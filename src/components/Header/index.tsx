'use client'

import { Session } from '@supabase/supabase-js'
import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '../Button'
import { Notifications } from '../Notifications'
import { ProfileMenu } from '../ProfileMenu'
import s from './styles.module.scss'

interface HeaderProps {
  session: Session | null
}

export function Header({ session }: HeaderProps) {
  if (session) {
    return (
      <div className={s.wrapper}>
        <header className={s.content}>
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
        </header>
      </div>
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
