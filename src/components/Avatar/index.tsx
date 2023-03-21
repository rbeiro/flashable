import { User } from 'phosphor-react'
import s from './styles.module.scss'

interface AvatarProps {
  url?: string
}

export function Avatar({ url }: AvatarProps) {
  if (url) {
    return <div>Foto</div>
  }
  return (
    <div className={s.container}>
      <User size={24} />
    </div>
  )
}
