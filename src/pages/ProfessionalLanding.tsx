
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Briefcase, TrendingUp, Users, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import ProfessionalHeader from '@/components/professional/ProfessionalHeader';
import { BestLocationsSection } from '@/components/BestLocationsSection';
import { ProfessionalFAQ } from '@/components/professional/ProfessionalFAQ';
import { ProfessionalCTA } from '@/components/professional/ProfessionalCTA';
import '@/styles/professional.css';

const ProfessionalLanding = () => {
  const qualifiedBuyers = useMemo(() => ({
    total: 124,
    areas: ['Milimani', 'Kiamunyi', 'Section 58', 'Njoro'],
  }), []);

  return (
    <>
      <ProfessionalHeader />
      <main className="bg-background">
        <section className="professional-hero-section">
          <ProfessionalCTA />
          
          <div className="professional-hero-stats">
            <div className="rounded-xl border p-4 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2 text-primary"><TrendingUp className="w-4 h-4" /> Views</div>
              <p className="mt-2 text-sm text-muted-foreground">Live listing demand visibility.</p>
            </div>
            <div className="rounded-xl border p-4 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2 text-primary"><Users className="w-4 h-4" /> Enquiry Trends</div>
              <p className="mt-2 text-sm text-muted-foreground">Track inbound enquiries.</p>
            </div>
            <div className="rounded-xl border p-4 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2 text-primary"><Briefcase className="w-4 h-4" /> Intent Scores</div>
              <p className="mt-2 text-sm text-muted-foreground">Prioritize serious buyers.</p>
            </div>
            <div className="rounded-xl border p-4 bg-card/80 backdrop-blur">
              <div className="flex items-center gap-2 text-primary"><Building2 className="w-4 h-4" /> BuyAbility</div>
              <p className="mt-2 text-sm text-muted-foreground">
                {qualifiedBuyers.total} qualified buyers active.
              </p>
            </div>
          </div>

          <p className="professional-hero-link">
            Looking to buy or rent?{' '}
            <Link to="/listings" className="underline underline-offset-4">Go to the buyer experience</Link>.
          </p>
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
