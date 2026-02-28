import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

export default function Redirect() {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate()
  const processed = useRef(false)

 useEffect(() => {
  if (!isLoaded || !user) return;
  if (processed.current) return;

  const syncRole = async () => {
    const role = 
    user.unsafeMetadata?.role ||
    user.unsafeMetadata?.role ||
    'buyer';

    if (!user.publicMetadata?.role) {
      await user.update({
        unsafeMetadata: {
          role,
          onboardingComplete: role === 'agent' ? false : true
        }
      })
    }

    processed.current = true

    if (role === "agent") navigate("/agent");
    else if (role === "buyer") navigate("/");
    else if (role === "host") navigate("/host/dashboard");
    else if (role === "professional") navigate("/professional");
    else if (role === "admin") navigate("/admin");
    else navigate("/");
  }

  syncRole();
 }, [isLoaded, user, navigate])

  return <div>Setting up your account...</div>
}
