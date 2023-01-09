import { BaseSyntheticEvent } from 'react'

export function getAndFormatFormData(schema: any, e: BaseSyntheticEvent) {
  const schemaKeys = Object.keys(schema.shape)
  let data: any
  for (const key in schemaKeys) {
    data = {
      ...data,
      [schemaKeys[key]]: e.target[schemaKeys[key]].value,
    }
  }

  return data
}
