
import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import TodaysFocus from "./components/TodaysFocus";
import PerformanceRadar from "./components/PerformanceRadar";
import MarketIntelligence from "./components/MarketIntelligence";
import CRMHub from "./components/CRMHub";
import AgencyModeToggle from "./components/AgencyModeToggle";
import { EmptyListingState } from "./components/command-center/EmptyListingState";
import { AddListingModal } from "./components/add-listing-modal/AddListingModal";

export default function NewAgentDashboard() {
  const [loading, setLoading] = useState(true);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6 md:space-y-8">
        {/* --- Page Header --- */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight truncate">
              Command Center
            </h1>
            <p className="hidden sm:block text-sm text-muted-foreground">
              Track your performance and manage your deals.
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <AgencyModeToggle />
            <ModeToggle />
          </div>
        </div>

        {/* --- Dashboard Content Grid --- */}
        <section>
          <TodaysFocus />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:h-[400px]">
          <PerformanceRadar />
          <MarketIntelligence />
        </div>

        <section>
          <CRMHub />
        </section>
        
        <section>
          <EmptyListingState
            onAddListing={() => setIsAddListingOpen(true)}
          />
        </section>
      </div>

      {/* --- Modals --- */}
      <AddListingModal
        open={isAddListingOpen}
        onOpenChange={setIsAddListingOpen}
      />
    </>
  );
}
