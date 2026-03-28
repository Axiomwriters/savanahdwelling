
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, Briefcase, TrendingUp, Users, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import ProfessionalHeader from '@/components/professional/ProfessionalHeader';
import { BestLocationsSection } from '@/components/BestLocationsSection';
import { ProfessionalFAQ } from '@/components/professional/ProfessionalFAQ';
import '@/styles/professional.css';

const ProfessionalLanding = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const qualifiedBuyers = useMemo(() => ({
    total: 124,
    areas: ['Milimani', 'Kiamunyi', 'Section 58', 'Njoro'],
  }), []);

  const handleSignup = (role: 'agent' | 'host') => {
    if (isAuthenticated) {
      if (role === 'agent') {
        navigate('/agent', { replace: true });
      } else {
        navigate('/dashboard/short-stay', { replace: true });
      }
      return;
    }

    navigate(`/sign-up?role=${role}`, { replace: false });
  };

  return (
    <>
      <ProfessionalHeader />
      <main className="bg-background">
        <section className="professional-main-section">
          <div className="rounded-2xl border bg-card p-6 md:p-10">
            <p 
              className="text-xs md:text-sm font-semibold uppercase tracking-wide text-primary"
            >
              Savanah Professional Hub · Nakuru, Kenya
            </p>
            <h1 
              className="mt-3 font-extrabold tracking-tight leading-tight professional-hero-title"
            >
              The All-in-One Suite for Kenyan Real Estate Professionals.
            </h1>
            <p 
              className="mt-4 text-muted-foreground max-w-3xl professional-hero-description"
            >
              Use the Savanah Intelligence Engine to value your listings,
              track demand signals, and convert more qualified buyers across Nakuru.
            </p>

            <div 
              className="mt-7 flex flex-col sm:flex-row gap-3 professional-hero-buttons"
            >
              <Button size="lg" className="w-full sm:w-auto" onClick={() => handleSignup('agent')}>
                Sign Up as Agent
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" onClick={() => handleSignup('host')}>
                Sign Up as Host (Short Stay)
              </Button>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border p-4 bg-background/70">
                <div className="flex items-center gap-2 text-primary"><TrendingUp className="w-4 h-4" /> Views</div>
                <p className="mt-2 text-sm text-muted-foreground">Live listing demand visibility by neighborhood.</p>
              </div>
              <div className="rounded-xl border p-4 bg-background/70">
                <div className="flex items-center gap-2 text-primary"><Users className="w-4 h-4" /> Enquiry Trends</div>
                <p className="mt-2 text-sm text-muted-foreground">Track inbound enquiries and closing velocity.</p>
              </div>
              <div className="rounded-xl border p-4 bg-background/70">
                <div className="flex items-center gap-2 text-primary"><Briefcase className="w-4 h-4" /> Intent Scores</div>
                <p className="mt-2 text-sm text-muted-foreground">Prioritize serious buyers with intent scoring.</p>
              </div>
              <div className="rounded-xl border p-4 bg-background/70">
                <div className="flex items-center gap-2 text-primary"><Building2 className="w-4 h-4" /> BuyAbility</div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {qualifiedBuyers.total} qualified buyers are active in {qualifiedBuyers.areas.join(', ')}.
                </p>
              </div>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              Looking to buy or rent?{' '}
              <Link to="/listings" className="underline underline-offset-4">Go to the buyer experience</Link>.
            </p>
          </div>
        </section>
        <BestLocationsSection />
        <ProfessionalFAQ />
      </main>
      <footer className="professional-footer">
        <div className="professional-footer-container">
          <p className="professional-footer-copyright">
            © 2026 Savanah Dwelling. All rights reserved.
          </p>
          <div className="professional-footer-social">
            <a href="#" aria-label="Facebook" className="social-icon"><Facebook size={18} /></a>
            <a href="#" aria-label="Twitter" className="social-icon"><Twitter size={18} /></a>
            <a href="#" aria-label="Instagram" className="social-icon"><Instagram size={18} /></a>
            <a href="#" aria-label="LinkedIn" className="social-icon"><Linkedin size={18} /></a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ProfessionalLanding;
