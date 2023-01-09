import s from './styles.module.scss'
import { Bell } from 'phosphor-react'

export function Notifications() {
  return (
    <div className={s.container}>
      <Bell size={24} />
    </div>
  )
}
