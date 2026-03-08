import React from 'react';
import { AgentSidebar } from '../../components/AgentSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { ModeToggle } from '@/components/mode-toggle';

const NewAgentDashboard: React.FC = () => {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AgentSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="flex justify-end items-center px-6 py-4 border-b">
            <ModeToggle />
          </header>
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-background p-6 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-semibold text-foreground">Welcome, Agent!</h1>
              <p className="mt-2 text-muted-foreground">This is your new dashboard.</p>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default NewAgentDashboard;
