import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { loginSchema, signupSchema, loginRateLimiter, type LoginFormData, type SignupFormData } from '@/lib/security';
import { cacheManager, performanceMonitor } from '@/lib/performance';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  role: 'admin' | 'teacher' | 'parent' | 'staff' | 'driver';
  is_active: boolean;
}

interface AuthState {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
}

interface AuthActions {
  signIn: (data: LoginFormData) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: SignupFormData) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  retry: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
}

const TIMEOUT_DURATION = 10000; // 10 seconds timeout
const MAX_RETRIES = 2;
const PROFILE_CACHE_KEY = 'user_profile';

export const useAuth = (): AuthState & AuthActions => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Initialize auth state with performance monitoring
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    performanceMonitor.markStart('auth-initialization');

    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        
        // Set timeout for initialization
        timeoutId = setTimeout(() => {
          if (mounted && isLoading) {
            console.warn('⚠️ Auth initialization timeout');
            setIsLoading(false);
            performanceMonitor.markEnd('auth-initialization');
          }
        }, TIMEOUT_DURATION);

        // Check for cached profile first
        const cachedProfile = cacheManager.get(PROFILE_CACHE_KEY);

        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session fetch error:', error);
          throw error;
        }

        if (!mounted) return;

        if (session?.user) {
          console.log('✅ Found existing session for user:', session.user.id);
          setSession(session);
          setUser(session.user);
          
          // Use cached profile if available, otherwise fetch
          if (cachedProfile && cachedProfile.user_id === session.user.id) {
            console.log('✅ Using cached profile');
            setUserProfile(cachedProfile);
          } else {
            await fetchUserProfile(session.user.id);
          }
        } else {
          console.log('ℹ️ No existing session found');
          setSession(null);
          setUser(null);
          setUserProfile(null);
          cacheManager.clear(PROFILE_CACHE_KEY);
        }

        clearTimeout(timeoutId);
        setIsLoading(false);
        performanceMonitor.markEnd('auth-initialization');
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        if (mounted) {
          clearTimeout(timeoutId);
          setIsLoading(false);
          performanceMonitor.markEnd('auth-initialization');
        }
      }
    };

    const fetchUserProfile = async (userId: string) => {
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle();

        if (error) throw error;

        if (mounted && profile) {
          setUserProfile(profile);
          cacheManager.set(PROFILE_CACHE_KEY, profile);
          console.log('✅ Profile loaded for role:', profile?.role);
        }
      } catch (error) {
        console.error('❌ Profile fetch failed:', error);
        if (mounted) {
          setUserProfile(null);
          cacheManager.clear(PROFILE_CACHE_KEY);
        }
      }
    };

    // Optimized auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔄 Auth state changed:', event, session?.user?.id || 'No user');
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setUserProfile(null);
          cacheManager.clear(PROFILE_CACHE_KEY);
        }
        
        if (isLoading) {
          setIsLoading(false);
          performanceMonitor.markEnd('auth-initialization');
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const signIn = useCallback(async (data: LoginFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate input
      const validatedData = loginSchema.parse(data);
      
      // Check rate limiting
      const clientId = `${validatedData.email}-${window.navigator.userAgent}`;
      if (loginRateLimiter.isRateLimited(clientId)) {
        const remainingTime = Math.ceil(loginRateLimiter.getRemainingTime(clientId) / 1000 / 60);
        return { 
          success: false, 
          error: `Too many login attempts. Please try again in ${remainingTime} minutes.` 
        };
      }

      console.log('🔐 Attempting sign in for:', validatedData.email);
      performanceMonitor.markStart('sign-in');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      clearTimeout(timeoutId);
      performanceMonitor.markEnd('sign-in');

      if (error) {
        console.error('❌ Sign in error:', error.message);
        
        // Handle specific error types with user-friendly messages
        if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
          return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email address before signing in.' };
        }
        if (error.message.includes('Too many requests') || error.message.includes('rate_limit')) {
          return { success: false, error: 'Too many login attempts. Please wait a moment and try again.' };
        }
        if (error.message.includes('signup_disabled')) {
          return { success: false, error: 'Sign up is currently disabled. Please contact support.' };
        }
        
        return { success: false, error: error.message };
      }

      if (!authData.user) {
        return { success: false, error: 'Login failed. Please try again.' };
      }

      console.log('✅ Sign in successful for user:', authData.user.id);
      setRetryCount(0); // Reset retry count on success
      
      // Clear any cached data from previous user
      cacheManager.clear();
      
      return { success: true };

    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      performanceMonitor.markEnd('sign-in');
      
      if (error.name === 'AbortError') {
        return { success: false, error: 'Login request timed out. Please check your connection and try again.' };
      }
      
      if (error.name === 'ZodError') {
        return { success: false, error: error.errors[0]?.message || 'Invalid input data' };
      }
      
      // Check if we should retry
      if (retryCount < MAX_RETRIES && (error.message?.includes('fetch') || error.message?.includes('network'))) {
        console.log(`🔄 Retrying sign in (${retryCount + 1}/${MAX_RETRIES})`);
        setRetryCount(prev => prev + 1);
        // Auto-retry after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return signIn(data);
      }
      
      return { success: false, error: 'Network error. Please check your internet connection and try again.' };
    }
  }, [retryCount]);

  const signUp = useCallback(async (data: SignupFormData): Promise<{ success: boolean; error?: string }> => {
    try {
      // Validate input
      const validatedData = signupSchema.parse(data);
      
      console.log('📝 Attempting sign up for:', validatedData.email);
      performanceMonitor.markStart('sign-up');
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: validatedData.email,
        password: validatedData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: validatedData.fullName,
            role: validatedData.role
          }
        }
      });

      performanceMonitor.markEnd('sign-up');

      if (error) {
        console.error('❌ Sign up error:', error.message);
        
        if (error.message.includes('already registered') || error.message.includes('already_exists')) {
          return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
        }
        if (error.message.includes('Password') || error.message.includes('password')) {
          return { success: false, error: 'Password does not meet security requirements.' };
        }
        if (error.message.includes('signup_disabled')) {
          return { success: false, error: 'Registration is currently disabled. Please contact support.' };
        }
        
        return { success: false, error: error.message };
      }

      console.log('✅ Sign up successful');
      return { success: true };

    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      performanceMonitor.markEnd('sign-up');
      
      if (error.name === 'ZodError') {
        return { success: false, error: error.errors[0]?.message || 'Invalid input data' };
      }
      
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('🚪 Signing out...');
      performanceMonitor.markStart('sign-out');
      
      await supabase.auth.signOut();
      
      // Clear all state and cache
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setRetryCount(0);
      cacheManager.clear();
      
      performanceMonitor.markEnd('sign-out');
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      performanceMonitor.markEnd('sign-out');
      toast.error('Error signing out. Please try again.');
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>): Promise<{ success: boolean; error?: string }> => {
    if (!user?.id) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id);

      if (error) throw error;

      // Update local state and cache
      const updatedProfile = { ...userProfile, ...updates } as UserProfile;
      setUserProfile(updatedProfile);
      cacheManager.set(PROFILE_CACHE_KEY, updatedProfile);

      return { success: true };
    } catch (error: any) {
      console.error('❌ Profile update error:', error);
      return { success: false, error: error.message || 'Failed to update profile' };
    }
  }, [user?.id, userProfile]);

  const retry = useCallback(() => {
    console.log('🔄 Retrying authentication...');
    setRetryCount(0);
    setIsLoading(true);
    cacheManager.clear();
    window.location.reload();
  }, []);

  return {
    session,
    user,
    userProfile,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    retry
  };
};