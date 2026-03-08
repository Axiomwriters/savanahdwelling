export type AppRole = 'agent' | 'host' | 'professional' | 'tenant' | 'buyer' | 'admin' | null | undefined;

export function resolveRedirect(role: AppRole): string {
  switch (role?.toLowerCase()) {
    case 'agent':
    case 'host':
    case 'professional':
      return '/ProfessionalDashboard';
    case 'admin':
      return '/dashboard/admin';
    case 'tenant':
    case 'buyer':
    default:
      return '/Dashboard';
  }
}

export function isProfessionalTier(role: AppRole): boolean {
  return role === 'agent' || role === 'host' || role === 'professional' || role === 'admin';
}
