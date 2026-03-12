import React from 'react';
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import Searchbar from './Searchbar';
import AgencyModeToggle from '@/pages/AgentDashboard/components/AgencyModeToggle';
import { ModeToggle } from '@/components/mode-toggle';

interface DashboardHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  hideSearchBar?: boolean;
  hideLogo?: boolean;
  hideThemeSwitcher?: boolean;
  isAgentDashboard?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  searchTerm, 
  onSearchChange, 
  hideSearchBar, 
  hideLogo, 
  hideThemeSwitcher, 
  isAgentDashboard 
}) => {
  const { setTheme, theme } = useTheme();

  return (
    <div className="grid grid-cols-3 items-center w-full px-4 py-2 lg:px-6 border-b">
      <div className="flex items-center gap-2 justify-start">
        {!hideLogo && (
          <img src="/Savanahdwell.png" alt="Savanah Dwelling" className="h-8" />
        )}
        {isAgentDashboard && (
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight truncate">
              Command Center
            </h1>
            <p className="hidden sm:block text-sm text-muted-foreground">
              Track your performance and manage your deals.
            </p>
          </div>
        )}
      </div>

      <div className="hidden md:flex flex-1 justify-center px-4 col-start-2">
        {!hideSearchBar && (
          <div className="w-full max-w-lg">
            <Searchbar searchTerm={searchTerm} onSearchChange={onSearchChange} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 justify-end col-start-3">
        {isAgentDashboard && (
          <>
            <AgencyModeToggle />
            <ModeToggle />
          </>
        )}
        {!hideThemeSwitcher && !isAgentDashboard && (
          <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
              <Moon className="hidden h-5 w-5 dark:block" />
              <span className="sr-only">Toggle theme</span>
            </Button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
