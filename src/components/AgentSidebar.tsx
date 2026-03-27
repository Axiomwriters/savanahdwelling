import { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
  LayoutDashboard,
  User,
  Home as HomeIcon,
  Map,
  Bell,
  Settings,
  ArrowLeft,
  HelpCircle,
  Mail,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SponsoredSpotlight } from "./agent-sidebar-widgets/SponsoredSpotlight";
import { AccountTierWidget } from "./agent-sidebar-widgets/AccountTierWidget";

const mainItems = [
  { title: "Dashboard", url: ".", icon: LayoutDashboard },
  { title: "My Profile", url: "profile", icon: User },
  { title: "My Listings", url: "listings", icon: HomeIcon },
  { title: "Trips & Viewings", url: "trips", icon: Map },
  { title: "Notifications", url: "notifications", icon: Bell },
  { title: "Settings", url: "settings", icon: Settings },
];

const supportItems = [
    { title: "Help Center", url: "help-center", icon: HelpCircle },
    { title: "Contact Support", url: "mailto:support@savanahdwelling.com", icon: Mail },
];

interface AgentSidebarContentProps {
  onNavigate?: () => void;
}

interface AgentSidebarProps {
  onNavigate?: () => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export function AgentSidebarContent({ onNavigate }: AgentSidebarContentProps = {}) {
  const { user, isLoaded } = useUser();
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) fetchCounts();
  }, [user]);

  const fetchCounts = async () => {
    // ... (fetch logic remains the same)
  };

  if (!isLoaded) return null;

  return (
    <div className="w-64 border-r bg-background flex flex-col h-full overflow-hidden">
      <div className="flex justify-center px-6 py-5 border-b shrink-0">
        <img
          src="/Savanahdwell.png"
          alt="Savanah Dwelling"
          className="h-14 object-contain"
        />
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="px-3 py-4 space-y-0.5">
          <p className="px-3 pb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            Agent Dashboard
          </p>
          {mainItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "."} // Ensures only exact match for Dashboard
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-foreground/70 hover:bg-muted hover:text-foreground"
                )
              }
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{item.title}</span>
              {item.title === "My Listings" && pendingCount > 0 && (
                <Badge className="ml-auto bg-yellow-500 text-white text-xs">
                  {pendingCount}
                </Badge>
              )}
              {item.title === "Notifications" && unreadCount > 0 && (
                <Badge className="ml-auto bg-primary text-primary-foreground text-xs">
                  {unreadCount}
                </Badge>
              )}
            </NavLink>
          ))}
          
          <p className="px-3 pt-4 pb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            Help & Support
          </p>
          {supportItems.map((item) => (
            <a
              key={item.title}
              href={item.url}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-foreground/70 hover:bg-muted hover:text-foreground"
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span>{item.title}</span>
            </a>
          ))}
        </nav>
        <div className="px-3 py-4 space-y-3 border-t">
          <SponsoredSpotlight />
          <AccountTierWidget />
          <Link
            to="/"
            onClick={onNavigate}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors text-foreground/70 hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" />
            <span>Back to Main Site</span>
          </Link>
        </div>
      </div>
      <div className="shrink-0 border-t px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <UserButton />
          <div className="flex-1 min-w-0 text-left text-sm leading-tight">
            <p className="truncate font-semibold">
              {user?.fullName || user?.firstName || "Agent"}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AgentSidebar({ onNavigate, isMobileOpen = false, onMobileToggle }: AgentSidebarProps) {
  const { user, isLoaded } = useUser();
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) fetchCounts();
  }, [user]);

  const fetchCounts = async () => {
    if (!user) return;
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("pending_listings_count, unread_notifications_count")
        .eq("id", user.id)
        .single();
      if (profile) {
        setPendingCount(profile.pending_listings_count || 0);
        setUnreadCount(profile.unread_notifications_count || 0);
      }
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <AgentSidebarContent onNavigate={onNavigate} />
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
            <h1 className="text-base font-bold text-foreground">Agent Dashboard</h1>
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
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav className="px-3 py-3 space-y-0.5">
            <p className="px-3 py-2 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
              Agent Dashboard
            </p>
            {mainItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                end={item.url === "."}
                onClick={() => {
                  onNavigate?.();
                  onMobileToggle?.();
                }}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors min-h-[48px]",
                    isActive
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "text-foreground/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground"
                  )
                }
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="flex-1">{item.title}</span>
                {item.title === "My Listings" && pendingCount > 0 && (
                  <Badge className="bg-yellow-500 text-white text-[10px] h-5 px-1.5">
                    {pendingCount}
                  </Badge>
                )}
                {item.title === "Notifications" && unreadCount > 0 && (
                  <Badge className="bg-emerald-500 text-white text-[10px] h-5 px-1.5">
                    {unreadCount}
                  </Badge>
                )}
              </NavLink>
            ))}

            <p className="px-3 pt-5 pb-2 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
              Help & Support
            </p>
            {supportItems.map((item) => (
              <a
                key={item.title}
                href={item.url}
                onClick={() => {
                  onNavigate?.();
                  onMobileToggle?.();
                }}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors text-foreground/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground min-h-[48px]"
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span>{item.title}</span>
              </a>
            ))}
          </nav>

          {/* Widgets */}
          <div className="px-3 py-3 space-y-3 border-t border-zinc-200 dark:border-zinc-800">
            <SponsoredSpotlight />
            <AccountTierWidget />
          </div>
        </div>

        {/* Pinned Footer with Profile Card */}
        <div className="shrink-0 border-t border-zinc-200 dark:border-zinc-800 px-3 py-3 bg-background space-y-3">
          <Link
            to="/"
            onClick={() => {
              onNavigate?.();
              onMobileToggle?.();
            }}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors text-foreground/80 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground min-h-[48px]"
          >
            <ArrowLeft className="w-5 h-5 shrink-0" />
            <span>Back to Main Site</span>
          </Link>

          {/* Profile Card */}
          {isLoaded && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
              <UserButton />
              <div className="flex-1 min-w-0 text-left text-sm leading-tight">
                <p className="truncate font-semibold text-foreground">
                  {user?.fullName || user?.firstName || "Agent"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
