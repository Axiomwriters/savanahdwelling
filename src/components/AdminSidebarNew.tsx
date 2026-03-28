import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { supabaseAdmin } from "@/integrations/supabase/adminClient";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Shield,
  Home,
  Map,
  Calendar,
  Building2,
  UserCog,
  Building,
  Settings,
  X,
  Crown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mainItems = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Accounts", url: "/admin/accounts", icon: Users },
  { title: "Verifications", url: "/admin/verifications", icon: Shield },
  { title: "Listings", url: "/admin/listings", icon: Home },
  { title: "Trips", url: "/admin/trips", icon: Map },
  { title: "Viewings", url: "/admin/viewings", icon: Calendar },
];

const managementItems = [
  { title: "Agents", url: "/admin/agents", icon: UserCog },
  { title: "Landlords", url: "/admin/landlords", icon: Building },
  { title: "Agencies", url: "/admin/agencies", icon: Building2 },
  { title: "Hosts", url: "/admin/hosts", icon: Crown },
];

const systemItems = [
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

interface AdminSidebarContentProps {
  onNavigate?: () => void;
}

interface AdminSidebarProps {
  onNavigate?: () => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

export function AdminSidebarContent({ onNavigate }: AdminSidebarContentProps = {}) {
  const [pendingVerifs, setPendingVerifs] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const { count } = await supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("verification_status", "pending");
      setPendingVerifs(count || 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

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
            Admin Command Center
          </p>
          {mainItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "."}
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
              {item.title === "Verifications" && pendingVerifs > 0 && (
                <Badge className="ml-auto bg-yellow-500 text-white text-xs">
                  {pendingVerifs}
                </Badge>
              )}
            </NavLink>
          ))}

          <p className="px-3 pt-4 pb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            User Management
          </p>
          {managementItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
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
            </NavLink>
          ))}

          <p className="px-3 pt-4 pb-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">
            System
          </p>
          {systemItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
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
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function AdminSidebar({ onNavigate, isMobileOpen = false, onMobileToggle }: AdminSidebarProps) {
  const [pendingVerifs, setPendingVerifs] = useState(0);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      const { count } = await supabaseAdmin
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("verification_status", "pending");
      setPendingVerifs(count || 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  return (
    <>
      <div className="hidden md:block">
        <AdminSidebarContent onNavigate={onNavigate} />
      </div>

      <div
        className={cn(
          "fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onMobileToggle}
        aria-hidden="true"
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-background border-r shadow-2xl transition-transform duration-300 ease-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b shrink-0 bg-background border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <img src="/Savanahdwell.png" alt="Savanah Dwelling" className="h-8 object-contain" />
            <h1 className="text-base font-bold text-foreground">Admin</h1>
          </div>
          <button
            onClick={onMobileToggle}
            className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <nav className="px-3 py-3 space-y-0.5">
            <p className="px-3 py-2 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
              Admin Command Center
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
                {item.title === "Verifications" && pendingVerifs > 0 && (
                  <Badge className="bg-yellow-500 text-white text-[10px] h-5 px-1.5">
                    {pendingVerifs}
                  </Badge>
                )}
              </NavLink>
            ))}

            <p className="px-3 pt-5 pb-2 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
              User Management
            </p>
            {managementItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
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
              </NavLink>
            ))}

            <p className="px-3 pt-5 pb-2 text-[10px] font-semibold text-muted-foreground tracking-widest uppercase">
              System
            </p>
            {systemItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
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
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
