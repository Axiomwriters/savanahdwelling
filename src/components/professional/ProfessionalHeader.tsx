
import React from 'react';
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import '@/styles/professional.css';

const ProfessionalHeader = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (isAuthenticated) {
      navigate('/agent/dashboard');
    } else {
      navigate('/sign-in');
    }
  };

  return (
    <header className="professional-header">
      <div className="professional-header-container">
        <img src="/Savanahdwell.png" alt="Savanah" style={{ height: '60px' }} />
        <nav className="professional-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ModeToggle />
            <Button variant="outline" size="sm" onClick={handleSignIn}>Sign In</Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default ProfessionalHeader;
