import React, { createContext, useContext, useEffect, useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthLayout } from "@/components/AuthLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { usePreloadComponents, useOptimizedRendering } from "@/hooks/usePerformance";
import { useInstantPreload, useMaxPerformance } from "@/hooks/useMaxPerformance";

// Lazy load dashboard components for better performance
const Index = lazy(() => import("./pages/Index"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const FinancePortal = lazy(() => import("./pages/FinancePortal"));
const DriverPortal = lazy(() => import("./pages/DriverPortal"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

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

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Maximum performance optimizations
  useInstantPreload();
  useMaxPerformance();

  useEffect(() => {
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();
            
            if (mounted) {
              setUserProfile(profile);
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
          }
        } else {
          if (mounted) {
            setUserProfile(null);
          }
        }
      }
    );

    // Get initial session and set loading to false after
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          if (mounted) {
            setUserProfile(profile);
          }
        } else {
          if (mounted) {
            setUserProfile(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        // Always set loading to false after initialization
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    userProfile,
    isLoading,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

const AppContent = () => {
  const { session, user, userProfile, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!session || !user || !userProfile) {
    return <AuthLayout />;
  }

  const getDashboardForRole = () => {
    switch (userProfile.role) {
      case 'parent':
        return <Index />;
      case 'teacher':
        return <TeacherDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'staff':
        return <FinancePortal />;
      case 'driver':
        return <DriverPortal />;
      default:
        return <Index />;
    }
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <div className="transition-all duration-300 ease-in-out">
          <Routes>
            <Route path="/" element={getDashboardForRole()} />
            <Route path="/teacher" element={userProfile.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" />} />
            <Route path="/admin" element={userProfile.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/finance" element={userProfile.role === 'staff' ? <FinancePortal /> : <Navigate to="/" />} />
            <Route path="/driver" element={userProfile.role === 'driver' ? <DriverPortal /> : <Navigate to="/" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
