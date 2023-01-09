import s from '../../../src/styles/Signup.module.scss'

export default function ConfirmEmailPage() {
  return (
    <div className={s.wrapper}>
      <h1>Confirme seu e-mail</h1>
      <div className={s.formContainer}>
        <p>
          Finalize seu cadastro acessando o e-mail cadastrado e confirmando o
          e-mail pela mensagem que enviamos.
        </p>

        <p>Assim que terminar a confirmação clique aqui:</p>
      </div>
    </div>
  )
}
