import { Dispatch, SetStateAction } from 'react'
import { z, ZodSchema } from 'zod'

export function validadeInputData(
  value: string,
  key: {},
  setState: Dispatch<
    SetStateAction<{
      data: null | string
      error: undefined | string
    }>
  >,
  schema: any,
) {
  const validationResult = schema.shape[key].safeParse(value)
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
