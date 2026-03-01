import { SignIn } from '@clerk/react-router'

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