import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Preloader } from "@/components/Preloader";
import { ScrollToTopHandler } from "@/components/ScrollToTopHandler";
import { ScrollToTop } from "@/components/ScrollToTop";
import { TripProvider } from "@/contexts/TripContext";
import { LocationAgentProvider } from "@/contexts/LocationAgentContext";
import Dashboard from "./pages/Dashboard";
import ExplorePage from "./pages/ExplorePage";
import BecomeAgent from "./pages/BecomeAgent";
import HydrateData from "./pages/HydrateData";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import AffordabilityPage from "./pages/AffordabilityPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import AgentDashboard from "./pages/AgentDashboard";
import AgentProfile from "./pages/AgentProfile";
import ProfessionalDashboard from "./pages/ProfessionalDashboard";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import HostDashboard from "./pages/HostDashboard";
import MainLayout from "@/components/MainLayout";
import UserProfileSettings from "./pages/UserProfileSettings";
import SavedProperties from "./pages/SavedProperties";
import AccountSettings from "./pages/AccountSettings";
import BuildingMaterialsShop from "./pages/Shop/BuildingMaterialsShop";
import ShortStayLayout from "@/components/layouts/ShortStayLayout";
import ShortStaySearch from "./pages/ShortStay/ShortStaySearch";
import ShortStayDetails from "./pages/ShortStay/ShortStayDetails";
import BookingCheckout from "./pages/ShortStay/BookingCheckout";
import BookingConfirmation from "./pages/ShortStay/BookingConfirmation";
import GuestDashboard from "./pages/ShortStay/GuestDashboard";
import TripDetails from "./pages/ShortStay/TripDetails";
import SignInPage from "./pages/SignIn";
import SignUpPage from "./pages/SignUp";
import Redirect from "./pages/Redirect";

const queryClient = new QueryClient();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <TooltipProvider>
          <TripProvider>
            <LocationAgentProvider>
              {isLoading && <Preloader />}
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <AuthProvider>
                  <ScrollToTopHandler />
                  <ScrollToTop />
                  <Routes>
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/properties" element={<Properties />} />
                      <Route path="/properties/:id" element={<PropertyDetail />} />
                      <Route path="/explore/:category" element={<ExplorePage />} />
                      <Route path="/affordability" element={<AffordabilityPage />} />
                      <Route path="/shop/building-materials" element={<BuildingMaterialsShop />} />
                    </Route>
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/auth/reset" element={<ResetPassword />} />
                    <Route path="/profile/settings" element={<UserProfileSettings />} />
                    <Route path="/saved-properties" element={<SavedProperties />} />
                    <Route path="/sign-in/*" element={<SignInPage />}/>
                    <Route path="/sign-up/*" element={<SignUpPage />}/>
                    <Route path="/redirect" element={<Redirect />}/>
                    <Route path="/account/settings" element={<AccountSettings />} />
                    <Route path="/agents/profile/:id" element={<AgentProfile />} />
                    <Route path="/become-agent" element={
                      <ProtectedRoute>
                        <BecomeAgent />
                      </ProtectedRoute>
                    } />
                    <Route
                      path="/professional/*"
                      element={
                        <ProtectedRoute requiredRole="professional">
                          <ProfessionalDashboard />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/agent/*"
                      element={
                          <ProtectedRoute requiredRole="agent">
                            <AgentDashboard />
                          </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/host/*"
                      element={
                        <ProtectedRoute requiredRole="agent">
                          <HostDashboard />
                        </ProtectedRoute>
                      }
                    />

                    {/* Short Stay Routes */}
                    <Route path="/short-stay" element={<ShortStayLayout />}>
                      <Route index element={<ShortStaySearch />} />
                      <Route path=":id" element={<ShortStayDetails />} />
                      <Route path="book/:id" element={<BookingCheckout />} />
                      <Route path="confirmation" element={<BookingConfirmation />} />
                      <Route path="trips" element={<GuestDashboard />} />
                      <Route path="trips/:id" element={<TripDetails />} />
                    </Route>


                    {/* Admin Portal Routes */}
                    <Route path="/admin-portal" element={<AdminLogin />} />
                    <Route path="/admin-dashboard" element={<AdminDashboard />} />
                    <Route path="/hydrate" element={<HydrateData />} />

                    <Route path="/unauthorized" element={<Unauthorized />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AuthProvider>
              </BrowserRouter>
            </LocationAgentProvider>
          </TripProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;