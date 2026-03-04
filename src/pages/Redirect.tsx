// src/pages/Redirect.tsx — Role sync + Supabase profile upsert + welcome email
import { useUser }       from "@clerk/clerk-react";
import { useNavigate }   from "react-router-dom";
import { useEffect, useRef } from "react";
import { supabase }      from "@/integrations/supabase/client";

export default function Redirect() {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate   = useNavigate();
  const processed  = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;
    if (processed.current) return;

    const syncRole = async () => {
      try {
        /* ─── 1. Resolve role ─────────────────────────────── */
        let role = user.unsafeMetadata?.role as string | undefined;

        if (!role) {
          role = localStorage.getItem('selectedRole') || 'buyer';
          await user.update({
            unsafeMetadata: {
              role,
              onboardingComplete: ['agent', 'host'].includes(role) ? false : true,
            },
          });
          await user.reload();
        }

        localStorage.removeItem('selectedRole');
        processed.current = true;

        /* ─── 2. Upsert Supabase profile ──────────────────── */
        // NOTE: This uses the anon key. The profiles table must allow
        // public inserts OR you should use the Edge Function approach.
        // See supabase/functions/sync-profile for the secure version.
        const primaryEmail = user.primaryEmailAddress?.emailAddress ?? '';
        await supabase
          .from('profiles')
          .upsert(
            {
              clerk_user_id:     user.id,
              full_name:         user.fullName ?? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
              avatar_url:        user.imageUrl ?? null,
              email:             primaryEmail,
              role,
              onboarding_complete: ['agent', 'host'].includes(role) ? false : true,
            },
            { onConflict: 'clerk_user_id' }
          );

        /* ─── 3. Trigger welcome email for agents (Edge Fn) ── */
        if (role === 'agent') {
          await supabase.functions.invoke('send-welcome-email', {
            body: {
              email:    primaryEmail,
              name:     user.firstName ?? 'Agent',
              role,
            },
          });
        }

        /* ─── 4. Navigate to role dashboard ──────────────── */
        switch (role) {
          case 'agent':        navigate('/agent',        { replace: true }); break;
          case 'host':         navigate('/host',         { replace: true }); break;
          case 'admin':        navigate('/command-center', { replace: true }); break;
          case 'professional': navigate('/professional', { replace: true }); break;
          case 'buyer':
          default:             navigate('/',             { replace: true }); break;
        }
      } catch (err) {
        console.error('Role sync error:', err);
        navigate('/auth', { replace: true });
      }
    };

    syncRole();
  }, [isLoaded, isSignedIn, user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted-foreground animate-pulse">Setting up your account…</p>
      </div>
    </div>
  );
}
