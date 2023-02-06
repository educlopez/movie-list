import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'

import { Button } from './Button'

export default function LogButton() {
  const supabase = useSupabaseClient()
  const session = useSession()

  return (
    <>
      {!session ? (
        <Button href="/login">Sign in</Button>
      ) : (
        <>
          <Button href="/login" variant="outline">
            Profile
          </Button>
          <Button onClick={() => supabase.auth.signOut()}>Log out</Button>
        </>
      )}
    </>
  )
}
