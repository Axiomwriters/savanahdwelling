import { useUser } from "@clerk/clerk-react";
import { replace, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Redirect() {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate()
  const processed = useRef(false)

 useEffect(() => {
  if (!isLoaded || !isSignedIn || !user) return;
  if (processed.current) return;

  const syncRole = async () => {
    try{
      let role =  user.unsafeMetadata?.role as string | undefined;

      if(!role) {
        role = 'buyer';

        await user.update({
          unsafeMetadata: {
            role,
            onboardingComplete: true,
          }
        })
          await user.reload()
      }
      
      processed.current = true;

      switch (role) {
        case 'agent':
          navigate('/agent', { replace: true })
          break

        case'host':
        navigate('/agent', { replace: true })
        break;

        case 'admin':
          navigate('/command-center', { replace :true })
          break;

        case 'professional':
          navigate('/professional', { replace :true })
          break;

        case 'buyer':
          navigate('/', { replace :true })
          break;
      }
    } catch (err) {
      console.log(err)
      navigate('/auth', { replace:true })
    }
  }

  syncRole();
 }, [isLoaded, isSignedIn, user, navigate])

  return <div>Setting up your account...</div>
}
