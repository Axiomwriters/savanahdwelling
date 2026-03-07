
// src/pages/ProfessionalDashboard.tsx
import { useState, useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { ProfessionalSidebar } from '@/components/ProfessionalSidebar';
import { HeaderWrapper } from '@/components/HeaderWrapper';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { ProtectedRoute } from '@/components/ProtectedRoute';

const DashboardHome = lazy(() => import('./ProfessionalDashboard/ProfessionalProfile'));
const ProfessionalProfile = lazy(() => import('./ProfessionalDashboard/ProfessionalProfile'));

export default function ProfessionalDashboard() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0.5);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <ProfessionalSidebar />

        <SidebarInset className="flex-1 w-full relative">
          <div className="sticky top-0 z-50 w-full transition-all duration-300">
            <HeaderWrapper isScrolled={isScrolled} />
          </div>

          <main className={cn('p-6 transition-all duration-300')}>
            <Suspense
              fallback={
                <div className="flex h-[50vh] w-full items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              }
            >
              <Routes>
                <Route index element={<DashboardHome />} />
                <Route path="profile" element={<ProfessionalProfile />} />
              </Routes>
            </Suspense>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
