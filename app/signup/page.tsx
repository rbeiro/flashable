'use client'
import { supabase } from '../../src/lib/supabase'
import { z } from 'zod'

import s from '../../src/styles/Signup.module.scss'
import { Input, PasswordInput } from '../../src/components/Inputs'
import {
  SyntheticEvent,
  FocusEvent,
  useState,
  Dispatch,
  SetStateAction,
} from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const SignUpSchema = z.object({
  name: z.string().min(1, {
    message: 'Campo obrigatório, por favor, insira seu nome.',
  }),
  email: z.string().email({
    message: 'Insira um endereço de e-mail válido',
  }),
  password: z.string().min(6, {
    message: 'A senha deve conter no minimo 6 coisas.',
  }),
  passwordConfim: z.string().min(6, {
    message: 'A senha deve conter no minimo 6 coisas.',
  }),
})

interface InputState {
  data: null | string
  error: undefined | string
}

type SignUp = z.infer<typeof SignUpSchema>

export default function SignUpPage() {
  const params = useSearchParams()
  const paramsEmail = params.get('email')
  console.log(paramsEmail)

  const [userName, setUserName] = useState<InputState>({
    data: null,
    error: undefined,
  })

  const [userEmail, setUserEmail] = useState<InputState>({
    data: paramsEmail || null,
    error: undefined,
  })

  console.log(userEmail)

  const [userPassword, setUserPassword] = useState<InputState>({
    data: null,
    error: undefined,
  })

  const [confirmUserPassword, setConfirmUserPassword] = useState<InputState>({
    data: null,
    error: undefined,
  })

  async function handleFormSubmit(e: SyntheticEvent) {
    e.preventDefault()
    if (
      userName.data !== null &&
      userEmail.data !== null &&
      userPassword.data !== null &&
      confirmUserPassword.data !== null
    ) {
      const { data, error } = await supabase.auth.signUp({
        email: userEmail.data,
        password: userPassword.data,
        options: {
          data: {
            name: userName.data,
          },
        },
      })

      console.log(data)
      console.log(error)
    }
  }

  function handleInputValidation(
    value: string,
    key: keyof SignUp,
    setState: Dispatch<
      SetStateAction<{
        data: null | string
        error: undefined | string
      }>
    >,
  ) {
    const validationResult = SignUpSchema.shape[key].safeParse(value)
    console.log(value)
    if (validationResult.success) {
      if (key === 'passwordConfim') {
        console.log(userPassword.data === value)
        console.log(value)
        if (userPassword.data === value) {
          setState({
            data: value,
            error: undefined,
          })
          return
        }

        setState({
          data: null,
          error: 'As senhas não conferem',
        })
        return
      }

      const inputData = {
        data: value,
        error: undefined,
      }
      setState(inputData)
      return
    }
    if (!validationResult.success) {
      setState({
        data: null,
        error: validationResult.error.errors[0].message.toString(),
      })
    }
  }

  return (
    <div className={s.wrapper}>
      <h1>Cadastro</h1>
      <form onSubmit={(e) => handleFormSubmit(e)} className={s.formContainer}>
        <h2>Insira os dados abaixo:</h2>
        <Input
          labelName="Nome"
          errorMessage={userName.error}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            handleInputValidation(e.target.value, 'name', setUserName)
          }
        />

        <Input
          errorMessage={userEmail.error}
          labelName="E-mail"
          defaultValue={paramsEmail || ''}
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            handleInputValidation(e.target.value, 'email', setUserEmail)
          }
        />

        <PasswordInput
          errorMessage={userPassword.error}
          labelName="Senha"
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            handleInputValidation(e.target.value, 'password', setUserPassword)
          }
        />

        <PasswordInput
          errorMessage={confirmUserPassword.error}
          labelName="Confirmar senha"
          onBlur={(e: FocusEvent<HTMLInputElement>) =>
            handleInputValidation(
              e.target.value,
              'passwordConfim',
              setConfirmUserPassword,
            )
          }
        />
        <span className={s.redirectLink}>
          Já possui uma conta? <Link href="/login">Faça o login.</Link>
        </span>
        <button type="submit">cadastrar-se</button>
      </form>
    </div>
  )
}
