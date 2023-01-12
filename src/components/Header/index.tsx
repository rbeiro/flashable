'use client'

import { Session } from '@supabase/supabase-js'
import Link from 'next/link'
import { Suspense, useState } from 'react'
import supabaseBrowser from '../../lib/supabase-browser'
import { useFlashCardStore } from '../../lib/zustand/flashCardStore'
import { Button } from '../Button'
import { Notifications } from '../Notifications'
import { ProfileMenu } from '../ProfileMenu'
import s from './styles.module.scss'

interface HeaderProps {
  session: Session | null
}

export function Header({ session: serverSideSession }: HeaderProps) {
  const [session, setSession] = useState(serverSideSession)
  const { userDataFirstLoad } = useFlashCardStore()
  if (!serverSideSession && userDataFirstLoad) {
    getSession()
  }

  async function getSession() {
    const {
      data: { session },
    } = await supabaseBrowser.auth.getSession()
    setSession(session)
  }

  if (session) {
    return (
      <header className={s.wrapper}>
        <div className={s.content}>
          <Link href={'/'} className={s.logo}>
            flashable
          </Link>
          <nav className={s.navContainer}>
            <Suspense fallback={<p>Loading...</p>}>
              <Notifications />
            </Suspense>
            <Suspense fallback={<p>Loading...</p>}>
              <ProfileMenu />
            </Suspense>
          </nav>
        </div>
      </header>
    )
  }
  return (
    <header className={s.wrapper}>
      <div className={s.content}>
        <Link href={'/'} className={s.logo}>
          flashable
        </Link>
        <nav className={s.navContainer}>
          <Button withLink variant="transparent-background">
            <Link href={'/login'}>entrar</Link>
          </Button>
          <Button withLink variant="border-only">
            <Link href={'/signup'}>cadastrar-se</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
