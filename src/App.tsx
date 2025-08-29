import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Landing from "@/pages/Landing";
import InventoryList from "@/pages/Inventory/InventoryList";
import TestDashboard from "@/pages/Testing/TestDashboard";
import SLADashboard from "@/pages/SLA/SLADashboard";
import FieldMonitoring from "@/pages/Field/FieldMonitoring";
import CompanyPortal from "@/pages/Company/CompanyPortal";
import GSMInventory from "@/pages/GSM/GSMInventory";
import ScrapTracking from "@/pages/Scrap/ScrapTracking";
import LabTracking from "@/pages/Laboratory/LabTracking";
import MainLayout from "@/components/Layout/MainLayout";

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Debug için location'ı göster
  console.log('=== ROUTING DEBUG ===');
  console.log('Current location:', location.pathname);
  console.log('Is authenticated:', isAuthenticated);
  console.log('Is loading:', isLoading);
  console.log('========================');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Landing />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/testing" element={<TestDashboard />} />
        <Route path="/sla" element={<SLADashboard />} />
        <Route path="/field" element={<FieldMonitoring />} />
        <Route path="/company" element={<CompanyPortal />} />
        <Route path="/gsm" element={<GSMInventory />} />
        <Route path="/scrap" element={<ScrapTracking />} />
        <Route path="/laboratory" element={<LabTracking />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <TooltipProvider>
          <Toaster />
          <AppContent />
        </TooltipProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
