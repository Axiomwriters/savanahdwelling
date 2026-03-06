// src/components/ProtectedRoute.tsx
import { useAuth, useUser } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

// All valid role values that Clerk unsafeMetadata.role can hold
type AppRole = 'buyer' | 'agent' | 'host' | 'professional' | 'admin';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: AppRole;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/sign-in'
}: ProtectedRouteProps) {
  const location = useLocation();
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();

  // Still loading Clerk session
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated → redirect to sign-in
  if (!isSignedIn) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

const userRole = user?.publicMetadata?.role as AppRole | undefined;
  // Role guard — admin always passes through
  if (requiredRole && userRole !== requiredRole && userRole !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
