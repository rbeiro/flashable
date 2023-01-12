'use client'
import { Button } from '../../../src/components/Button'
import s from './styles.module.scss'

export default function ConfirmEmailPage() {
  return (
    <div className={s.wrapper}>
      <h1>Confirme seu e-mail</h1>
      <div className={s.formContainer}>
        <div className={s.nextStepsTextContainer}>
          <p>
            Finalize seu cadastro acessando sua caixa de entrada, e confirme o
            e-mail pela mensagem que enviamos.
          </p>

          <p>Assim que finalizar a confirmação clique aqui: </p>
        </div>
        <Button type="submit">Verificar confirmação</Button>
      </div>
    </div>
  )
}
