import { useState, useEffect, Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AgentSidebar } from "@/components/AgentSidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const DashboardOverview = lazy(() => import("./AgentDashboard/DashboardOverview"));
const AgentProfile = lazy(() => import("./AgentDashboard/AgentProfile"));
const MyListings = lazy(() => import("./AgentDashboard/MyListings"));
const CreateListing = lazy(() => import("./AgentDashboard/CreateListing"));
const Notifications = lazy(() => import("./AgentDashboard/Notifications"));
const AgentSettings = lazy(() => import("./AgentDashboard/AgentSettings"));
const AgentTripsPanel = lazy(() => import("./AgentDashboard/components/AgentTripsPanel"));

export default function AgentDashboard() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AgentSidebar />

        <SidebarInset className="flex-1 w-full relative">
          <div className="sticky top-0 z-50 w-full transition-all duration-300">
            <HeaderWrapper isScrolled={isScrolled} />
          </div>

          <main className={cn("p-6 transition-all duration-300")}>
            <Suspense fallback={
              <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            }>
              <Routes>
                <Route index element={<DashboardOverview />} />
                <Route path="profile" element={<AgentProfile />} />
                <Route 
                path="listings" 
                element={
                <ProtectedRoute requiredRole="agent">
                  <MyListings />
                </ProtectedRoute>
              } 
                />
                <Route path="listings/new" element={<CreateListing />} />
                <Route path="listings/edit/:id" element={<CreateListing />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="trips" element={<AgentTripsPanel />} />
                <Route
                 path="settings"
                element={
                  <ProtectedRoute requiredRole="agent">
                    <AgentSettings />
                  </ProtectedRoute>
                } 
                />
              </Routes>
            </Suspense>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
