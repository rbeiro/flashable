import { Dispatch, SetStateAction } from 'react'

export function validadeInputData(
  value: string,
  key: any,
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
