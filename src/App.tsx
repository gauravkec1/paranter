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
  const [isLoading, setIsLoading] = useState(true); // Start as true

  useEffect(() => {
    // Single source of truth for auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            setUserProfile(null);
          } else {
            setUserProfile(profile);
          }
        } else {
          setUserProfile(null);
        }
        
        // Loading is finished after the first check
        setIsLoading(false); 
      }
    );

    // Cleanup subscription on unmount
    return () => {
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
  
  const getRedirectPathForRole = () => {
    switch (userProfile.role) {
      case 'parent':
        return '/dashboard'; // Parent's main view
      case 'teacher':
        return '/teacher';
      case 'admin':
        return '/admin';
      case 'staff': // Finance
        return '/finance';
      case 'driver':
        return '/driver';
      default:
        return '/dashboard'; // Fallback
    }
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Redirect from root to the user's specific dashboard */}
          <Route path="/" element={<Navigate to={getRedirectPathForRole()} replace />} />

          {/* Role-specific routes wrapped in protection */}
          <Route path="/dashboard" element={<Index />} />

          <Route element={<ProtectedRoute requiredRole="teacher" />}>
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Route>
          
          <Route element={<ProtectedRoute requiredRole="admin" />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

          <Route element={<ProtectedRoute requiredRole="staff" />}>
            <Route path="/finance" element={<FinancePortal />} />
          </Route>
          
          <Route element={<ProtectedRoute requiredRole="driver" />}>
            <Route path="/driver" element={<DriverPortal />} />
          </Route>

          {/* Add other specific routes for all users here, e.g., /profile, /settings */}

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