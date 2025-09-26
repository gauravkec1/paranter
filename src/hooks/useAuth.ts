import { useState, useEffect, useCallback } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, role: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  retry: () => void;
}

const TIMEOUT_DURATION = 8000; // 8 seconds timeout
const MAX_RETRIES = 2;

export const useAuth = (): AuthState & AuthActions => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  // Initialize auth state
  useEffect(() => {
    let mounted = true;
    let timeoutId: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        
        // Set timeout for initialization
        timeoutId = setTimeout(() => {
          if (mounted && isLoading) {
            console.warn('⚠️ Auth initialization timeout');
            setIsLoading(false);
          }
        }, TIMEOUT_DURATION);

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
          
          // Fetch user profile
          await fetchUserProfile(session.user.id);
        } else {
          console.log('ℹ️ No existing session found');
          setSession(null);
          setUser(null);
          setUserProfile(null);
        }

        clearTimeout(timeoutId);
        setIsLoading(false);
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        if (mounted) {
          clearTimeout(timeoutId);
          setIsLoading(false);
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

        if (mounted) {
          setUserProfile(profile);
          console.log('✅ Profile loaded for role:', profile?.role);
        }
      } catch (error) {
        console.error('❌ Profile fetch failed:', error);
        if (mounted) {
          setUserProfile(null);
        }
      }
    };

    // Auth state listener
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
        }
        
        if (isLoading) {
          setIsLoading(false);
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

  const signIn = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('🔐 Attempting sign in for:', email);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      clearTimeout(timeoutId);

      if (error) {
        console.error('❌ Sign in error:', error.message);
        
        // Handle specific error types
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password. Please check your credentials.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { success: false, error: 'Please verify your email address before signing in.' };
        }
        if (error.message.includes('Too many requests')) {
          return { success: false, error: 'Too many login attempts. Please wait a moment and try again.' };
        }
        
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'Login failed. Please try again.' };
      }

      console.log('✅ Sign in successful for user:', data.user.id);
      setRetryCount(0); // Reset retry count on success
      return { success: true };

    } catch (error: any) {
      console.error('❌ Sign in network error:', error);
      
      if (error.name === 'AbortError') {
        return { success: false, error: 'Login request timed out. Please check your connection and try again.' };
      }
      
      // Check if we should retry
      if (retryCount < MAX_RETRIES && (error.message?.includes('fetch') || error.message?.includes('network'))) {
        console.log(`🔄 Retrying sign in (${retryCount + 1}/${MAX_RETRIES})`);
        setRetryCount(prev => prev + 1);
        // Auto-retry after a short delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return signIn(email, password);
      }
      
      return { success: false, error: 'Network error. Please check your internet connection and try again.' };
    }
  }, [retryCount]);

  const signUp = useCallback(async (email: string, password: string, fullName: string, role: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('📝 Attempting sign up for:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            full_name: fullName,
            role: role || 'parent'
          }
        }
      });

      if (error) {
        console.error('❌ Sign up error:', error.message);
        
        if (error.message.includes('already registered')) {
          return { success: false, error: 'An account with this email already exists. Please sign in instead.' };
        }
        if (error.message.includes('Password')) {
          return { success: false, error: 'Password must be at least 6 characters long.' };
        }
        
        return { success: false, error: error.message };
      }

      console.log('✅ Sign up successful');
      return { success: true };

    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      return { success: false, error: 'Registration failed. Please try again.' };
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      console.log('🚪 Signing out...');
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setUserProfile(null);
      setRetryCount(0);
      console.log('✅ Sign out successful');
    } catch (error) {
      console.error('❌ Sign out error:', error);
      toast.error('Error signing out. Please try again.');
    }
  }, []);

  const retry = useCallback(() => {
    console.log('🔄 Retrying authentication...');
    setRetryCount(0);
    setIsLoading(true);
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
    retry
  };
};