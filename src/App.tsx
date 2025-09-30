import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import TeacherDashboard from "./pages/TeacherDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import FinancePortal from "./pages/FinancePortal";
import DriverPortal from "./pages/DriverPortal";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/finance" element={<FinancePortal />} />
          <Route path="/driver" element={<DriverPortal />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
