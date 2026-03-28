import { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Home, Calendar, Users, CreditCard, Building2, HardHat, PenTool, Calculator, TrendingUp, Shield, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { useNavigate } from 'react-router-dom';

interface CTASlide {
  id: string;
  badge: string;
  title: string;
  description: string;
  features: { icon: React.ReactNode; text: string }[];
  buttons: { label: string; action: () => void; primary?: boolean }[];
  visual: { icon: string; title: string; subtitle: string; stats?: { value: string; label: string }[] };
  floats?: { icon: string; text: string }[];
}

export function ProfessionalCTA() {
  const navigate = useNavigate();
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!carouselApi) return;

    const interval = setInterval(() => {
      carouselApi.scrollNext();
    }, 10000);

    return () => clearInterval(interval);
  }, [carouselApi]);

  const handleSignup = (role: 'agent' | 'host') => {
    navigate(`/sign-up?role=${role}`, { replace: false });
  };

  const handleProfessionalSignup = () => {
    navigate(`/sign-up?role=professional`, { replace: false });
  };

  const handleProfessionalDashboard = () => {
    navigate('/professionalDashboard', { replace: false });
  };

  const slides: CTASlide[] = [
    {
      id: 'rental',
      badge: 'Rental Manager',
      title: 'List a property, schedule showings, screen tenants, collect payments',
      description: 'Do it all in one place with Rental Manager. Join thousands of agents and hosts who are growing their business with Savanah.',
      features: [
        { icon: <Home className="w-5 h-5" />, text: 'List properties effortlessly' },
        { icon: <Calendar className="w-5 h-5" />, text: 'Schedule and manage showings' },
        { icon: <Users className="w-5 h-5" />, text: 'Screen tenants thoroughly' },
        { icon: <CreditCard className="w-5 h-5" />, text: 'Collect payments securely' },
      ],
      buttons: [
        { label: 'Sign Up as Agent', action: () => handleSignup('agent'), primary: true },
        { label: 'Sign Up as Host', action: () => handleSignup('host') },
      ],
      visual: {
        icon: '🏠',
        title: 'Rental Manager',
        subtitle: 'All in one place',
        stats: [
          { value: '2,500+', label: 'Properties' },
          { value: '500+', label: 'Agents' },
        ],
      },
      floats: [
        { icon: '🚀', text: 'Get Started Today' },
        { icon: '✨', text: 'Free to Join' },
      ],
    },
    {
      id: 'professional',
      badge: 'Professional Network',
      title: 'Connect with clients, showcase your work, and grow your professional network',
      description: 'Join architects, engineers, interior designers, and other professionals who are building their reputation on Savanah.',
      features: [
        { icon: <Building2 className="w-5 h-5" />, text: 'Architectural services exposure' },
        { icon: <HardHat className="w-5 h-5" />, text: 'Engineering project leads' },
        { icon: <PenTool className="w-5 h-5" />, text: 'Interior design portfolios' },
        { icon: <Calculator className="w-5 h-5" />, text: 'Valuation & surveying jobs' },
      ],
      buttons: [
        { label: 'Join as Professional', action: handleProfessionalSignup, primary: true },
        { label: 'Go to Dashboard', action: handleProfessionalDashboard },
      ],
      visual: {
        icon: '🏗️',
        title: 'Professional Hub',
        subtitle: 'Build your reputation',
        stats: [
          { value: '200+', label: 'Professionals' },
          { value: '100+', label: 'Projects' },
        ],
      },
      floats: [
        { icon: '📈', text: 'Grow Your Career' },
        { icon: '🤝', text: 'Client Connections' },
      ],
    },
    {
      id: 'host',
      badge: 'Short Stay Host',
      title: 'Turn your property into a profitable short-stay business',
      description: 'List your home, apartment, or villa on Savanah and start earning. We handle the bookings, payments, and guest communication for you.',
      features: [
        { icon: <Home className="w-5 h-5" />, text: 'List any type of property' },
        { icon: <TrendingUp className="w-5 h-5" />, text: 'Dynamic pricing tools' },
        { icon: <Shield className="w-5 h-5" />, text: 'Verified guests only' },
        { icon: <DollarSign className="w-5 h-5" />, text: 'Guaranteed payments' },
      ],
      buttons: [
        { label: 'Become a Host', action: () => handleSignup('host'), primary: true },
        { label: 'Host Dashboard', action: () => navigate('/dashboard/short-stay') },
      ],
      visual: {
        icon: '🏡',
        title: 'Host Dashboard',
        subtitle: 'Manage with ease',
        stats: [
          { value: '98%', label: 'Guest Satisfaction' },
          { value: 'KSh 120K', label: 'Avg. Monthly' },
        ],
      },
      floats: [
        { icon: '💰', text: 'Maximize Earnings' },
        { icon: '🛡️', text: 'Full Protection' },
      ],
    },
  ];

  return (
    <section className="professional-cta-section">
      <Carousel className="w-full" opts={{ loop: true }} setApi={setCarouselApi}>
        <CarouselContent>
          {slides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className="professional-cta-container">
                <div className="professional-cta-content">
                  <span className="professional-cta-badge">{slide.badge}</span>
                  <h2 className="professional-cta-title">{slide.title}</h2>
                  <p className="professional-cta-description">{slide.description}</p>
                  
                  <div className="professional-cta-features">
                    {slide.features.map((feature, index) => (
                      <div key={index} className="professional-cta-feature">
                        {feature.icon}
                        <span>{feature.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="professional-cta-buttons">
                    {slide.buttons.map((button, index) => (
                      <Button
                        key={index}
                        size="lg"
                        onClick={button.action}
                        className={button.primary ? 'professional-cta-btn-primary' : 'professional-cta-btn-secondary'}
                      >
                        {button.label}
                        {button.primary && <ArrowRight className="ml-2 w-4 h-4" />}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="professional-cta-visual">
                  <div className="professional-cta-card">
                    <div className="professional-cta-card-header">
                      <div className="professional-cta-card-icon">{slide.visual.icon}</div>
                      <div>
                        <h4>{slide.visual.title}</h4>
                        <p>{slide.visual.subtitle}</p>
                      </div>
                    </div>
                    {slide.visual.stats && (
                      <div className="professional-cta-stats">
                        {slide.visual.stats.map((stat, index) => (
                          <div key={index} className="professional-cta-stat">
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {slide.floats && slide.floats.map((float, index) => (
                    <div key={index} className={`professional-cta-float-card cta-float-${index + 1}`}>
                      <span>{float.icon}</span>
                      <span>{float.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
        <CarouselNext className="right-2 bg-background/80 backdrop-blur-sm border-border/50 hover:bg-background" />
      </Carousel>
    </section>
  );
}
