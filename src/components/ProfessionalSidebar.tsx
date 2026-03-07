
// src/components/ProfessionalSidebar.tsx
import { Sidebar, SidebarHeader, SidebarNav, SidebarNavItem, SidebarFooter } from "@/components/ui/sidebar";
import { Home, User, Settings, Briefcase } from "lucide-react";

export function ProfessionalSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <Briefcase className="w-6 h-6 text-primary" />
        <span className="text-lg font-semibold">Professional Hub</span>
      </SidebarHeader>
      <SidebarNav>
        <SidebarNavItem href="/professional" icon={<Home size={20} />} text="Dashboard" />
        <SidebarNavItem href="/professional/profile" icon={<User size={20} />} text="Profile" />
        <SidebarNavItem href="/professional/services" icon={<Briefcase size={20} />} text="My Services" />
        <SidebarNavItem href="/professional/settings" icon={<Settings size={20} />} text="Settings" />
      </SidebarNav>
      <SidebarFooter>
        {/* You can add a footer item here if needed */}
      </SidebarFooter>
    </Sidebar>
  );
}
