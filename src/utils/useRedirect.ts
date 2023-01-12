import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export function useRedirect() {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  function redirectTo(routeToInput: string) {
    setIsRedirecting(true)
    if (pathname === routeToInput) {
      window.location.reload()
      return
    }
    router.push(routeToInput)
    console.log('Redirected the user')
  }

  function refreshPage() {
    setIsRedirecting(true)
    router.refresh()
    console.log('Page refreshed')
  }

  return {
    isRedirecting,
    redirectTo,
    refreshPage,
  }
}
