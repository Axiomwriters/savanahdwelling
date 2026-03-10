import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  sidebar: React.ReactNode;
}

export function DashboardLayout({ sidebar }: DashboardLayoutProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  // Note: The scroll listener is now on the main content area, not the window.
  // This effect can be adapted if scroll-based header changes are needed.

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {sidebar}

        <SidebarInset className="flex-1 w-full relative flex flex-col h-screen max-h-screen">
          <div className="shrink-0 sticky top-0 z-40 w-full bg-background/80 backdrop-blur-lg border-b">
            <HeaderWrapper isScrolled={true} hideLogo={true} hideSearchBar={true} hideThemeSwitcher={false} />
          </div>

          <main 
            className={cn("flex-1 overflow-y-auto p-6 lg:p-8")}
            onScroll={(e) => setIsScrolled(e.currentTarget.scrollTop > 0.5)}
          >
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
