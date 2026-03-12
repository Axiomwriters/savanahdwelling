import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import DashboardHeader from "@/components/DashboardHeader";
import { cn } from "@/lib/utils";

interface HeaderWrapperProps {
  isScrolled?: boolean;
  onOpenTrip?: () => void;
  hideLogo?: boolean;
  hideSearchBar?: boolean;
  hideThemeSwitcher?: boolean;
  isAgentDashboard?: boolean;
}

export function HeaderWrapper({
  isScrolled = false,
  onOpenTrip,
  hideLogo = false,
  hideSearchBar = false,
  hideThemeSwitcher = false,
  isAgentDashboard = false,
}: HeaderWrapperProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);

    if (term) {
      setSearchParams({ search: term });
    } else {
      const params = new URLSearchParams(searchParams);
      params.delete("search");
      setSearchParams(params);
    }
  };

  return (
    <div
      className={cn(
        "w-full border-b border-border/40 transition-all duration-150 ease-out",
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-md"
          : "bg-background shadow-sm"
      )}
    >
      {/* Main dashboard header */}
      <DashboardHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        hideLogo={hideLogo}
        hideSearchBar={hideSearchBar}
        hideThemeSwitcher={hideThemeSwitcher}
        isAgentDashboard={isAgentDashboard}
      />
    </div>
  );
}
