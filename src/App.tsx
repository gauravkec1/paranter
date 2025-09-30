import React, { createContext, useContext, useEffect, useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthLayout } from "@/components/AuthLayout";
import { LoadingScreen } from "@/components/LoadingScreen";

// Lazy load dashboard components for better performance
const Index = lazy(() => import("./pages/Index")); // Parent Dashboard
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const FinancePortal = lazy(() => import("./pages/FinancePortal"));
const DriverPortal = lazy(() => import("./pages/DriverPortal"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// --- TYPE DEFINITIONS ---
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

// --- AUTH CONTEXT & HOOK ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- AUTH PROVIDER ---
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    let isMounted = true;
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (isMounted) {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            try {
              const { data: profile, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', session.user.id)
                .single();
              
              if (isMounted) {
                if (error) {
                  // Handle profile fetch error silently
                  setUserProfile(null);
                } else {
                  setUserProfile(profile);
                }
              }
            } catch (profileError) {
              if (isMounted) {
                setUserProfile(null);
              }
            }
          } else {
            if (isMounted) {
              setUserProfile(null);
            }
          }
          
          if (isMounted) {
            setIsLoading(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            if (isMounted) {
              if (error) {
                setUserProfile(null);
              } else {
                setUserProfile(profile);
              }
            }
          } catch (profileError) {
            if (isMounted) {
              setUserProfile(null);
            }
          }
        } else {
          if (isMounted) {
            setUserProfile(null);
          }
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      }
    );

    getInitialSession();

    // Cleanup function
    return () => {
      isMounted = false;
      setMounted(false);
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = { session, user, userProfile, isLoading, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// --- PROTECTED ROUTE COMPONENT ---
// This component protects routes based on user role
const ProtectedRoute = ({ requiredRole }: { requiredRole: UserProfile['role'] }) => {
    const { userProfile } = useAuth();

    // If the user's role matches the required role, render the child routes (Outlet)
    // Otherwise, navigate them back to their default dashboard
    return userProfile?.role === requiredRole ? <Outlet /> : <Navigate to="/" replace />;
};


// --- APP CONTENT & ROUTING ---
const AppContent = () => {
  const { session, userProfile, isLoading } = useAuth();

  // Show loading screen until the initial auth check is complete
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If there is no session, show the authentication layout (login/signup)
  if (!session) {
    return <AuthLayout />;
  }

  // If there is a session but no profile yet (still fetching or failed), show loading
  if (!userProfile) {
    return <LoadingScreen />;
  }
  
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Role-specific routes with proper redirects */}
          <Route path="/" element={
            userProfile?.role === 'parent' ? <Index /> : 
            <Navigate to={`/${userProfile?.role === 'staff' ? 'finance' : userProfile?.role}`} replace />
          } />

          {/* Parent dashboard route */}
          <Route element={<ProtectedRoute requiredRole="parent" />}>
            <Route path="/dashboard" element={<Index />} />
          </Route>

          {/* Teacher routes */}
          <Route element={<ProtectedRoute requiredRole="teacher" />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Route>
          
          {/* Admin routes */}
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          {/* Finance staff routes */}
          <Route element={<ProtectedRoute requiredRole="staff" />}>
            <Route path="/finance" element={<FinancePortal />} />
          </Route>
          
          {/* Driver routes */}
          <Route element={<ProtectedRoute requiredRole="driver" />}>
            <Route path="/driver" element={<DriverPortal />} />
          </Route>

          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// --- MAIN APP COMPONENT ---
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;