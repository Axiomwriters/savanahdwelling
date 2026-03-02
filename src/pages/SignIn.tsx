// src/pages/SignIn.tsx
import { SignIn } from '@clerk/clerk-react'  // ← was @clerk/react-router

export default function SignInPage() {
  return (
    <div className='w-full flex justify-center mt-16'>
      <SignIn
        routing="path"
        path="/sign-in"
        fallbackRedirectUrl="/redirect"
      />
    </div>
  )
}
