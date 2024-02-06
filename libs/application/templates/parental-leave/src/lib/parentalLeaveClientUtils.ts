import { SelectOption } from '../types'

export function getSelectOptionLabel(options: SelectOption[], id?: string) {
  if (id === undefined) {
    return undefined
  }

  return options.find((option) => option.id === id)?.name
}
