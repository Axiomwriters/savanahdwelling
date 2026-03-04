// src/pages/SSOCallback.tsx — Handles Google/OAuth redirect back from Clerk
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'

export default function SSOCallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-muted-foreground">Completing sign-in…</p>
      </div>
      {/*
        Clerk's component reads the URL hash/params set by the OAuth provider
        and completes the authentication flow, then redirects to /redirect
        (as specified in redirectUrlComplete during authenticateWithRedirect).
      */}
      <AuthenticateWithRedirectCallback />
    </div>
  )
}
