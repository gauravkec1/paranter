import React, { Suspense, lazy, memo } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthLayout from "@/components/AuthLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { usePreloadComponents, useOptimizedRendering } from "@/hooks/usePerformance";
import { useInstantPreload, useMaxPerformance } from "@/hooks/useMaxPerformance";
import { preloadCriticalResources } from "@/hooks/useLazyComponent";
import { useAuth } from "@/hooks/useAuth";

// Optimized lazy loading with smart prefetching
const Index = lazy(() => import("./pages/Index"));
const ParentDashboard = lazy(() => import("./pages/ParentDashboard"));
const TeacherDashboard = lazy(() => import("./pages/TeacherDashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const FinancePortal = lazy(() => import("./pages/FinancePortal"));
const DriverPortal = lazy(() => import("./pages/DriverPortal"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Optimized QueryClient with performance settings
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaces cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Preload critical resources immediately
preloadCriticalResources();

// Memoized for better performance
const AppContent = memo(() => {
  const { session, user, userProfile, isLoading } = useAuth();
  
  // Maximum performance optimizations
  useInstantPreload();
  useMaxPerformance();

  if (isLoading) {
    console.log('App: Showing loading screen - isLoading:', isLoading);
    return <LoadingScreen />;
  }

  if (!session || !user || !userProfile) {
    console.log('App: Showing auth layout - session:', !!session, 'user:', !!user, 'userProfile:', !!userProfile);
    return <AuthLayout />;
  }

  const getDashboardForRole = () => {
    console.log('App: Getting dashboard for role:', userProfile?.role);
    // Ensure complete portal isolation - users only see their role's dashboard
    switch (userProfile.role) {
      case 'parent':
        console.log('App: Loading ParentDashboard');
        return <ParentDashboard />;
      case 'teacher':
        console.log('App: Loading TeacherDashboard');
        return <TeacherDashboard />;
      case 'admin':
        console.log('App: Loading AdminDashboard');
        return <AdminDashboard />;
      case 'staff':
        console.log('App: Loading FinancePortal');
        return <FinancePortal />;
      case 'driver':
        console.log('App: Loading DriverPortal');
        return <DriverPortal />;
      default:
        console.log('App: Loading default ParentDashboard for unknown role:', userProfile.role);
        // Default to parent portal for any unknown roles
        return <ParentDashboard />;
    }
  };

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <div className="critical-above-fold">
          <Routes>
            {/* All users get redirected to their role-specific dashboard */}
            <Route path="/" element={getDashboardForRole()} />
            {/* Strict portal isolation - only allow access to user's own role */}
            <Route path="/teacher" element={userProfile.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" replace />} />
            <Route path="/admin" element={userProfile.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" replace />} />
            <Route path="/finance" element={userProfile.role === 'staff' ? <FinancePortal /> : <Navigate to="/" replace />} />
            <Route path="/driver" element={userProfile.role === 'driver' ? <DriverPortal /> : <Navigate to="/" replace />} />
            {/* Catch-all route for any unknown URLs */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </Suspense>
    </BrowserRouter>
  );
});

const App = () => {
  console.log("🏗️ App component rendering...");
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div style={{ padding: '20px', background: 'white', color: 'black', minHeight: '100vh' }}>
            <h1>App is loading...</h1>
            <p>If you see this, the basic app structure is working.</p>
            <AppContent />
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;