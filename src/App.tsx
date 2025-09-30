import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/components/AuthLayout";
import { LoadingScreen } from "@/components/LoadingScreen";
import Index from "./pages/Index";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FinancePortal from "./pages/FinancePortal";
import DriverPortal from "./pages/DriverPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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
      <Routes>
        <Route path="/" element={getDashboardForRole()} />
        <Route path="/teacher" element={userProfile.role === 'teacher' ? <TeacherDashboard /> : <Navigate to="/" />} />
        <Route path="/admin" element={userProfile.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
        <Route path="/finance" element={userProfile.role === 'staff' ? <FinancePortal /> : <Navigate to="/" />} />
        <Route path="/driver" element={userProfile.role === 'driver' ? <DriverPortal /> : <Navigate to="/" />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

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
