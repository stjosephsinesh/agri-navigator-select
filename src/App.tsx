
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import WeatherData from "./pages/WeatherData";
import DataChecks from "./pages/DataChecks";
import DistrictCropSelection from "./pages/DistrictCropSelection";
import CoverSelection from "./pages/CoverSelection";
import QuickTool from "./pages/QuickTool";
import BurnCost from "./pages/BurnCost";
import Users from "./pages/Users";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout><Dashboard /></Layout>} />
          <Route path="/weather-data" element={<Layout><WeatherData /></Layout>} />
          <Route path="/data-checks" element={<Layout><DataChecks /></Layout>} />
          <Route path="/district-crop-selection" element={<Layout><DistrictCropSelection /></Layout>} />
          <Route path="/cover-selection" element={<Layout><CoverSelection /></Layout>} />
          <Route path="/quick-tool" element={<Layout><QuickTool /></Layout>} />
          <Route path="/burn-cost" element={<Layout><BurnCost /></Layout>} />
          <Route path="/users" element={<Layout><Users /></Layout>} />
          <Route path="/help" element={<Layout><Help /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
