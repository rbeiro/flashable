import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function useRedirect() {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()

  function redirectTo(routeToInput: string) {
    setIsRedirecting(true)
    router.push(routeToInput)
  }

  return {
    isRedirecting,
    redirectTo,
  }
}
