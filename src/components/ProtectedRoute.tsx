
// src/components/ProtectedRoute.tsx
import { useAuth, useUser } from "@clerk/clerk-react";
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AppRole, isProfessionalTier } from "@/utils/AuthRedirectHandler";

type RequiredRole = Exclude<AppRole, null | undefined> | 'professional-tier';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: RequiredRole;
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

  // Correctly get the role from unsafeMetadata
  const userRole = user?.unsafeMetadata?.role as AppRole;

  if (requiredRole === 'professional-tier' && !isProfessionalTier(userRole)) {
    if (!userRole) return <Navigate to="/redirect" replace />;
    return <Navigate to="/unauthorized" replace />;
  }

  // Role guard — admin always passes through
  if (
    requiredRole
    && requiredRole !== 'professional-tier'
    && userRole !== requiredRole
    && userRole !== 'admin'
  ) {
    // If the role is missing, it's a sign-up incompletion.
    // Redirect to a page that can handle that, e.g., /redirect
    if (!userRole) return <Navigate to="/redirect" replace />;
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
