'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import supabaseBrowser from '../../lib/supabase-browser'

export default function SupabaseListener({
  accessToken,
  session,
}: {
  accessToken?: string
  session: any
}) {
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== accessToken) {
        router.refresh()
      }
      switch (event) {
        case 'SIGNED_OUT':
          console.log(event)
          break

        case 'SIGNED_IN':
          console.log(event)
          break

        case 'TOKEN_REFRESHED':
          console.log(event)
          console.log('Token refreshed')
          break

        default:
      }
    })
  }, [])

  return null
}
