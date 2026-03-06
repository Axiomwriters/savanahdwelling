// src/components/HeaderWrapper.tsx
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { TopHeaderBar } from "@/components/TopHeaderBar";
import DashboardHeader from "@/components/DashboardHeader";
import { cn } from "@/lib/utils";

interface HeaderWrapperProps {
  isScrolled?: boolean;  // ← was required, now optional (default false)
  onOpenTrip?: () => void;
}

export function HeaderWrapper({ isScrolled = false }: HeaderWrapperProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term) {
      setSearchParams({ search: term });
    } else {
      searchParams.delete("search");
      setSearchParams(searchParams);
    }
  };

  return (
    <div className="flex flex-col w-full z-[60] top-0">
      <div
        className={cn(
          "w-full border-b border-border/40 transition-all duration-150 ease-out",
          isScrolled
            ? "bg-background/80 backdrop-blur-md shadow-md"
            : "bg-background shadow-sm"
        )}
      >
        <div
          className={cn(
            "w-full overflow-hidden transition-[height,opacity] duration-150 ease-out",
            isScrolled ? "h-0 opacity-0" : "h-[40px] opacity-100"
          )}
        >
          <div className="border-b border-border/10">
            <TopHeaderBar />
          </div>
        </div>
        <DashboardHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
        />
      </div>
    </div>
  );
}
