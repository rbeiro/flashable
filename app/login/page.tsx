'use client'

import {
  Dispatch,
  FocusEvent,
  SetStateAction,
  SyntheticEvent,
  useState,
} from 'react'

import { Input, PasswordInput } from '../../src/components/Inputs'
import supabase from '../../src/lib/supabase-browser'
import { z } from 'zod'
import s from '../../src/styles/Signup.module.scss'
import { useFlashCardStore } from '../../src/lib/zustand/flashCardStore'
import { Toast } from '../../src/components/Toast'
import { Button } from '../../src/components/Button'
import { useRedirect } from '../../src/utils/useRedirect'

const SignUpSchema = z.object({
  email: z.string().email({
    message: 'Insira um endereço de e-mail válido',
  }),
  password: z.string().min(6, {
    message: 'Insira uma senha válida',
  }),
})

interface InputState {
  data: null | string
  error: undefined | string
}

type SignUp = z.infer<typeof SignUpSchema>

interface ToastMessage {
  id: string
  isOpen: boolean
  success?: boolean
  title?: string
  message?: string
}

export default function LoginPage() {
  const { userDataFirstLoad, setUserDataFirstLoad, getInitialSections } =
    useFlashCardStore()

  console.log('Data was loaded for the first time: ' + userDataFirstLoad)
  const { isRedirecting, redirectTo } = useRedirect()

  const [toastMessages, setToastMessages] = useState<ToastMessage[]>([])

  const [userEmail, setUserEmail] = useState<InputState>({
    data: null,
    error: undefined,
  })

  const [userPassword, setUserPassword] = useState<InputState>({
    data: null,
    error: undefined,
  })

  async function handleLoginSubmit(e: SyntheticEvent) {
    e.preventDefault()
    if (userEmail.data !== null && userPassword.data !== null) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail.data,
        password: userPassword.data,
      })

      console.log(data)

      if (data.session) {
        if (!userDataFirstLoad) {
          await getInitialSections()
          setUserDataFirstLoad(true)
          redirectTo('/app')
          return
        }

        redirectTo('/app')
        return
      }

      if (error?.message === 'Email not confirmed') {
        setToastMessages((state) => [
          ...state,
          {
            id: crypto.randomUUID(),
            isOpen: true,
            success: false,
            title: 'E-mail não confirmado',
            message:
              'Por favor, verifique sua caixa de entrada, e confirme seu e-mail.',
          },
        ])
      }
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

    if (validationResult.success) {
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

  function handleToastDisplay(id: string, open: boolean) {
    // Set "isOpen" to false to trigger the hide animation
    setToastMessages((state) => {
      const updatedArray = state.map((cur) => {
        if (cur.id === id) {
          return {
            ...cur,
            isOpen: open,
          }
        }
        return cur
      })
      return updatedArray
    })

    // Wait until the hide animation end and remove the message
    setTimeout(() => {
      setToastMessages((state) => {
        const deleteCurrentMessage = state.filter((cur) => cur.id !== id)
        return deleteCurrentMessage
      })
    }, 100)
  }

  return (
    <div className={s.wrapper}>
      <h1>Login</h1>
      <form onSubmit={handleLoginSubmit} className={s.formContainer}>
        <h2>Insira os dados abaixo:</h2>
        <Input
          errorMessage={userEmail.error}
          labelName="E-mail"
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
        <Button isLoading={isRedirecting} fillParent type="submit">
          fazer login
        </Button>
      </form>

      {toastMessages.length > 0 && (
        <div className={s.toastMessagesContainer}>
          {toastMessages.map((toast) => {
            return (
              <Toast
                key={toast.id}
                open={toast.isOpen}
                handleOpenChange={(open) => {
                  if (!open) handleToastDisplay(toast.id, open)
                }}
                success={toast.success}
                title={toast.title}
                description={toast.message}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}
