import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type AppRole = 'agent' | 'host' | 'tenant' | 'admin' | 'professional' | 'buyer' | undefined;
type SyncStatus = 'checking' | 'timeout';

const MAX_RETRIES = 7;
const BASE_BACKOFF_MS = 500;
const MAX_BACKOFF_MS = 4000;

const getRoleRedirectPath = (role: AppRole) => {
  switch (role) {
    case 'agent':
      return '/dashboard/agent';
    case 'host':
      return '/dashboard/short-stay';
    case 'tenant':
      return '/dashboard/tenant';
    case 'admin':
      return '/dashboard/admin';
    default:
      return '/';
  }
};

const SyncPage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();
  const [status, setStatus] = useState<SyncStatus>('checking');

  const role = user?.unsafeMetadata?.role as AppRole;
  const roleRedirectPath = useMemo(() => getRoleRedirectPath(role), [role]);

  const checkSupabaseRecord = useCallback(async () => {
    if (!user) {
      return;
    }

    setStatus('checking');

    for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
      const { data, error } = await supabase
        .from('profiles')
        .select('clerk_user_id')
        .eq('clerk_user_id', user.id)
        .maybeSingle();

      if (data?.clerk_user_id) {
        navigate(roleRedirectPath, { replace: true });
        return;
      }

      if (error && error.code !== 'PGRST116') {
        console.error('Profile sync check failed:', error.message);
      }

      const backoffMs = Math.min(BASE_BACKOFF_MS * (2 ** attempt), MAX_BACKOFF_MS);
      await new Promise(resolve => setTimeout(resolve, backoffMs));
    }

    setStatus('timeout');
  }, [navigate, roleRedirectPath, user]);

  useEffect(() => {
    if (!isLoaded || !user) {
      return;
    }

    void checkSupabaseRecord();
  }, [checkSupabaseRecord, isLoaded, user]);

  if (status === 'timeout') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-4 border rounded-xl p-6 bg-card">
          <p className="text-lg font-semibold">We are still finalizing your account.</p>
          <p className="text-sm text-muted-foreground">
            Your profile is taking longer than expected to provision. You can retry sync now or continue.
          </p>
          <div className="flex flex-col gap-2">
            <Button onClick={() => void checkSupabaseRecord()}>
              Retry profile sync
            </Button>
            <Button variant="outline" onClick={() => navigate(roleRedirectPath, { replace: true })}>
              Continue to dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <Loader2 className="w-10 h-10 mx-auto animate-spin text-primary" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Finalizing your account setup...
        </p>
      </div>
    </div>
  );
};

export default SyncPage;
