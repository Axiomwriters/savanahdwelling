import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Users,
  BarChart,
  ArrowLeft,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from '@clerk/clerk-react'

const mainItems = [
  { title: "Dashboard", url: "/professional", icon: LayoutDashboard },
  { title: "My Profile", url: "/professional/profile", icon: User },
  { title: "Projects", url: "/professional/projects", icon: Briefcase },
  { title: "Clients", url: "/professional/clients", icon: Users },
  { title: "Analytics", url: "/professional/analytics", icon: BarChart },
];

interface ProfessionalSidebarProps {
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export function ProfessionalSidebar({ isMobileOpen = false, onMobileToggle }: ProfessionalSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const isCollapsed = state === "collapsed";
  const { user, isLoaded } = useUser();

  const handleNavigate = () => {
    onMobileToggle?.();
  };

  if (!isLoaded) return null;

  const renderSidebarContent = (isMobile: boolean = false) => (
    <>
      <div className="flex-1 overflow-y-auto">
        <nav className={isMobile ? "px-3 py-3 space-y-0.5" : ""}>
          {!isMobile && (
            <SidebarGroup>
              <SidebarGroupLabel className={isCollapsed ? "hidden" : ""}>
                Professional Dashboard
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainItems.map((item) => {
                    const isActive = location.pathname === item.url;
                    return (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild>
                          <Link
                            to={item.url}
                            className={cn(
                              "flex items-center gap-3 hover:bg-primary/10 transition-all",
                              isActive && "bg-primary/20 border-l-4 border-primary text-primary font-medium"
                            )}
                          >
                            <item.icon className="w-4 h-4" />
                            {!isCollapsed && (
                              <>
                                <span>{item.title}</span>
                              </>
                            )}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {isMobile && (
            <>
              <p className="px-3 py-2 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
                Professional Dashboard
              </p>
              {mainItems.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.title}
                    to={item.url}
                    onClick={handleNavigate}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors min-h-[48px]",
                      isActive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "text-foreground/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
                    )}
                  >
                    <item.icon className="w-5 h-5 shrink-0" />
                    <span className="flex-1">{item.title}</span>
                  </Link>
                );
              })}
            </>
          )}

          {!isMobile && (
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        to="/"
                        className="flex items-center gap-3 hover:bg-muted transition-all"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        {!isCollapsed && <span>Back to Main Site</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {isMobile && (
            <div className="px-3 py-3 border-t border-zinc-200 dark:border-zinc-800 mt-4">
              <Link
                to="/"
                onClick={handleNavigate}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors text-foreground/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground min-h-[48px]"
              >
                <ArrowLeft className="w-5 h-5 shrink-0" />
                <span>Back to Main Site</span>
              </Link>
            </div>
          )}
        </nav>
      </div>

      <div className={isMobile ? "shrink-0 border-t border-zinc-200 dark:border-zinc-800 px-3 py-3 bg-background space-y-3" : ""}>
        {!isMobile && (
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UserButton />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user?.fullName || user?.firstName|| 'Professional'}</span>
                    <span className="truncate text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        )}

        {isMobile && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
            <UserButton />
            <div className="flex-1 min-w-0 text-left text-sm leading-tight">
              <p className="truncate font-semibold text-foreground">
                {user?.fullName || user?.firstName || "Professional"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar className={cn(isCollapsed ? "w-14" : "w-60", "bg-background")}>
          <SidebarTrigger className="m-2 self-end" />
          <SidebarContent>
            {renderSidebarContent(false)}
          </SidebarContent>
        </Sidebar>
      </div>

      {/* Mobile Drawer Overlay */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onMobileToggle}
        aria-hidden="true"
      />

      {/* Mobile Drawer */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background border-r shadow-2xl transition-transform duration-300 ease-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sticky Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <img src="/Savanahdwell.png" alt="Savanah Dwelling" className="h-8 object-contain" />
            <h1 className="text-base font-bold text-foreground">Professional Dashboard</h1>
          </div>
          <button
            onClick={onMobileToggle}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        {/* Scrollable Content */}
        {renderSidebarContent(true)}
      </div>
    </>
  );
}
