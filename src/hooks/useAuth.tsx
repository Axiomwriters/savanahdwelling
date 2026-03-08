// src/hooks/useAuth.tsx
import {
  useAuth as useClerkAuth,
  useUser,
} from "@clerk/clerk-react";
import { createContext, useContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AppRole, isProfessionalTier } from "@/utils/AuthRedirectHandler";

// ─── Types ────────────────────────────────────────────────────────────────────
interface AuthContextType {
  user: ReturnType<typeof useUser>['user'];
  isAuthenticated: boolean;
  userRole: AppRole;
  isAgent: boolean;
  isHost: boolean;
  isProfessional: boolean;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  viewMode: 'buyer' | 'renter';
  toggleViewMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, signOut: clerkSignOut } = useClerkAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<'buyer' | 'renter'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('user_view_mode');
      return saved === 'buyer' || saved === 'renter' ? saved : 'buyer';
    }
    return 'buyer';
  });

  const toggleViewMode = () => {
    setViewMode(prev => {
      const next = prev === 'buyer' ? 'renter' : 'buyer';
      localStorage.setItem('user_view_mode', next);
      toast.success(`Switched to ${next === 'buyer' ? 'Buyer' : 'Renter'} mode`);
      return next;
    });
  };

  const signOut = async () => {
    await clerkSignOut();
    navigate('/');
    toast.success('Successfully signed out');
  };

  // Derive role from Clerk unsafeMetadata
  const userRole = (user?.unsafeMetadata?.role as AppRole) ?? null;
  const isAuthenticated = !!isSignedIn;
  const isAgent = userRole === 'agent' || userRole === 'admin';
  const isHost = userRole === 'host' || userRole === 'admin';
  const isProfessional = isProfessionalTier(userRole);
  const isAdmin = userRole === 'admin';
  const loading = !isLoaded;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        userRole,
        isAgent,
        isHost,
        isProfessional,
        isAdmin,
        loading,
        signOut,
        viewMode,
        toggleViewMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
