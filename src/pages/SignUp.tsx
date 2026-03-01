import { SignUp } from '@clerk/react-router'
import { useUser } from '@clerk/clerk-react'
import { useEffect, useState, useRef } from 'react'

export default function SignUpPage () {
  const { user, isLoaded } = useUser()
  const [selectedRole, setSelectedRole] = useState('buyer')
  const roleAssigned = useRef(false)

  useEffect(() => {
    localStorage.setItem('selectedRole', selectedRole)
  }, [selectedRole])

  useEffect(() => {
      if(!isLoaded ||  !user) return
      if(roleAssigned.current) return

  const setRole = async () => {
    const role = localStorage.getItem('selectedRole') || 'buyer'

    if (!user.unsafeMetadata?.role) {
      await user.update({
        unsafeMetadata: {
          role,
          onboardingComplete: role === 'agent' ? false : true
        }
      })
    }
    roleAssigned.current = true
  }
  setRole()
  }, [isLoaded, user])

  return (
    <div className='w-full flex flex-col items-center mt-10 gap-6'>
      <div className="w-[400px]">
        <label className="font-semibold">Select your role:</label>

        <select
          className="w-full border p-2 rounded-full mt-2"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="buyer">Buyer / Client</option>
          <option value="agent">Agent</option>
          <option value="host">Host</option>
          <option value="professional">Professional</option>
        </select>
      </div>

      <SignUp
        routing="path"
        path="/sign-up"
        fallbackRedirectUrl="/redirect"
        unsafeMetadata={{ role: selectedRole }}
      />
    </div>
  )
}