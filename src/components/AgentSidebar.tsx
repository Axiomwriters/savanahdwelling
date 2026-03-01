import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  LayoutDashboard,
  User,
  Home as HomeIcon,
  Map,
  Plus,
  Bell,
  Settings,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { SponsoredSpotlight } from "./agent-sidebar-widgets/SponsoredSpotlight";
import { AccountTierWidget } from "./agent-sidebar-widgets/AccountTierWidget";
import { UserButton, useUser } from '@clerk/clerk-react'

const mainItems = [
  { title: "Dashboard", url: "/agent", icon: LayoutDashboard },
  { title: "My Profile", url: "/agent/profile", icon: User },
  { title: "My Listings", url: "/agent/listings", icon: HomeIcon },
  { title: "Trips & Viewings", url: "/agent/trips", icon: Map },
  // { title: "Add New Listing", url: "/agent/listings/new", icon: Plus }, // Removed as per Smart Modal request
  { title: "Notifications", url: "/agent/notifications", icon: Bell, badge: 3 },
  { title: "Settings", url: "/agent/settings", icon: Settings },
];

export function AgentSidebar() {
  const { state } = useSidebar();
  // const { user, signOut } = useAuth();
  const location = useLocation();
  const isCollapsed = state === "collapsed";
  const [pendingCount, setPendingCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  // useEffect(() => {
  //   if (user) fetchCounts();
  // }, [user]);

  const fetchCounts = async () => {
    try {
      const { count: pending } = await supabase
        .from("agent_listings")
        .select("*", { count: "exact", head: true })
        .eq("agent_id", user!.id)
        .eq("status", "pending");

      const { count: unread } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("read", false);

      setPendingCount(pending || 0);
      setUnreadCount(unread || 0);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  // const handleLogout = async () => {
  //   await signOut();
  //   toast.success("Logged out successfully");
  // };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"}>
      <SidebarTrigger className="m-2 self-end" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "hidden" : ""}>
            Agent Dashboard
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
                            {item.title === "My Listings" && pendingCount > 0 && (
                              <Badge className="ml-auto bg-yellow-500">{pendingCount}</Badge>
                            )}
                            {item.title === "Notifications" && unreadCount > 0 && (
                              <Badge className="ml-auto bg-primary">{unreadCount}</Badge>
                            )}
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

        <div className="mt-auto">
          {!isCollapsed && (
            <>
              <SponsoredSpotlight />
              <AccountTierWidget />
            </>
          )}
        </div>

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
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.user_metadata?.full_name} />
                <AvatarFallback className="rounded-lg">
                  {(user?.user_metadata?.full_name || user?.email || "AG").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.user_metadata?.full_name || 'Agent'}</span>
                <span className="truncate text-xs">{user?.email}</span>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleLogout();
                }}
                className="ml-auto hover:bg-destructive/10 hover:text-destructive p-2 rounded-md transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="size-4" />
              </div> */}
              <UserButton />
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user?.fullName || user?.firstName|| 'Agent'}</span>
                <span className="truncate text-xs">{user?.primaryEmailAddress?.emailAddress}</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
