import 'server-only'

import { ReactNode, Suspense } from 'react'
import { Header } from '../src/components/Header'
import SupabaseListener from '../src/components/SupabaseListener'
import { createClient } from '../src/lib/supabase-server'
import '../src/styles/global.scss'

import s from '../src/styles/Layout.module.scss'

export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  return (
    <html lang="pt-br" className="dark-theme">
      <head>
        <title>Flashable</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={'true'}
        />
        {/* eslint-disable-next-line */}
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@500&family=Hind&display=swap" rel="stylesheet" />
        {/* eslint-disable-next-line */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>

      <body>
        <SupabaseListener
          accessToken={session?.access_token}
          session={session}
        />
        <Suspense fallback={<p>Loading header...</p>}>
          <Header session={session} />
        </Suspense>
        <main className={s.pageContainer}>{children}</main>
      </body>
    </html>
  )
}
