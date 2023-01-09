import 'server-only'

import { ReactNode } from 'react'
import s from '../../src/styles/Signup.module.scss'
export const revalidate = 0

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return <section className={s.container}>{children}</section>
}
