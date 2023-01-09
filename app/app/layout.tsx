import { redirect } from 'next/navigation'
import { ReactNode } from 'react'
import { createClient } from '../../src/lib/supabase-server'

import s from '../../src/styles/App.module.scss'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const supabase = createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/')
  }

  return (
    <section className={s.content}>
      <h1>Flashcards</h1>
      {children}
    </section>
  )
}
