
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth, useUser } from '@clerk/clerk-react';
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
  const { user } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignIn = (role: 'agent' | 'host') => {
    navigate(`/sign-in?role=${role}`);
  };

  const handleDashboard = () => {
    const role = user?.publicMetadata.role as string;

    if (role === 'host') {
      navigate('/dashboard/short-stay');
    } else if (role === 'agent') {
      navigate('/agent/dashboard');
    } else {
      // Fallback for other roles or if role is not defined
      navigate('/');
    }
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
