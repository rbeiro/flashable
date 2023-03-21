'use client'

import { useRouter } from 'next/navigation'
// import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import supabaseBrowser from '../../lib/supabase-browser'

export default function SupabaseListener({
  accessToken,
}: {
  accessToken?: string
}) {
  const router = useRouter()

  useEffect(() => {
    supabaseBrowser.auth.onAuthStateChange((event, session) => {
      switch (event) {
        case 'SIGNED_OUT':
          console.log(event)
          router.push('/#')
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
  }, [router])

  return null
}
