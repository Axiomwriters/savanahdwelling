
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '@/styles/professional.css';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, Menu, X } from 'lucide-react';

const ProfessionalHeader = () => {
  const { isAuthenticated, userRole } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMenuOpen]);

  const handleSignIn = (role: 'agent' | 'host') => {
    navigate(`/sign-in?role=${role}`);
  };

  const handleDashboard = () => {
    if (userRole === 'host') {
      navigate('/dashboard/short-stay');
    } else {
      navigate('/agent');
    }
  };

  const navLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Demo', href: '/demo' },
  ];

  return (
    <>
      <header className="professional-header">
        <div className="professional-header-container">
          <img src="/Savanahdwell.png" alt="Savanah" style={{ height: '60px' }} />
          <nav className="professional-nav">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div className="professional-nav-links desktop-nav">
                {navLinks.map((link) => (
                  <a key={link.href} href={link.href} className="nav-link">
                    {link.label}
                  </a>
                ))}
              </div>
              {isAuthenticated ? (
                <Button variant="outline" size="sm" onClick={handleDashboard}>Dashboard</Button>
              ) : (
                <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      Sign In
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleSignIn('agent')}>
                      Sign in as Agent
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSignIn('host')}>
                      Sign in as Host
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <ModeToggle />
              <button 
                className="mobile-menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>
      </header>
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(false)} />
      <div className={`mobile-nav ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <X size={22} />
          </button>
        </div>
        <div className="mobile-nav-links">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProfessionalHeader;
