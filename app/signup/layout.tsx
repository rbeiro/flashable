import 'server-only'

import { ReactNode } from 'react'
import { createClient } from '../../src/lib/supabase-server'
import s from './styles/SignupLayout.module.scss'
import { redirect } from 'next/navigation'
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

  if (session) {
    redirect('/')
  }
  return <section className={s.container}>{children}</section>
}
