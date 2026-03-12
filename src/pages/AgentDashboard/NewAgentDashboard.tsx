
import { useState } from "react";
import TodaysFocus from "./components/TodaysFocus";
import PerformanceRadar from "./components/PerformanceRadar";
import MarketIntelligence from "./components/MarketIntelligence";
import CRMHub from "./components/CRMHub";
import { EmptyListingState } from "./components/command-center/EmptyListingState";
import { AddListingModal } from "./components/add-listing-modal/AddListingModal";

export default function NewAgentDashboard() {
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);

  return (
    <>
      <div className="space-y-6 md:space-y-8">
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
