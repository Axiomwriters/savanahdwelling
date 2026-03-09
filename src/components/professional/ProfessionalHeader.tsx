
import { useState } from 'react';
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
import { ChevronDown } from 'lucide-react';

const ProfessionalHeader = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignIn = (role: 'agent' | 'host') => {
    if (isAuthenticated) {
      if (role === 'agent') {
        navigate('/agent/dashboard');
      } else {
        navigate('/dashboard/short-stay');
      }
    } else {
      navigate(`/sign-in?role=${role}`);
    }
  };

  const handleDashboard = () => {
    // This assumes a default or primary dashboard for the authenticated user
    // You might want to refine this based on the user's actual role
    navigate('/agent/dashboard');
  };

  return (
    <header className="professional-header">
      <div className="professional-header-container">
        <img src="/Savanahdwell.png" alt="Savanah" style={{ height: '60px' }} />
        <nav className="professional-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ModeToggle />
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
          </div>
        </nav>
      </div>
    </header>
  );
};

export default ProfessionalHeader;
