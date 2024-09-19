import { ChangeEvent, FC, FocusEvent, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'

import { Input } from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'

import { validate } from '../../utils/validate'
import { InputProps } from './types'

/**
 * A reusable input component for names. It handles input validation for names,
 * setting and removing the validation's error message.
 */
const InputName: FC<InputProps> = (props) => {
  const {
    // The initial value.
    value,

    // A function that runs on blur if the input is valid.
    onBlur,

    // A custom label. Id not set, a default label is used.
    label,

    // A custom placeholder. Id not set, a default placeholder is used.
    placeholder,

    onChange,
  } = props

  const { formatMessage } = useIntl()

  const [errorMessage, setErrorMessage] = useState<string>()
  const [inputValue, setInputValue] = useState<string>(value || '')

  const handleBlur = (
    evt: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>,
  ) => {
    const inputValidator = validate([[evt.target.value, ['empty']]])

    if (inputValidator.isValid) {
      setErrorMessage(undefined)
      onBlur(inputValue)
    } else {
      setErrorMessage(inputValidator.errorMessage)
    }
  }

  const handleChange = (
    evt: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setInputValue(evt.target.value)
    onChange && onChange(inputValue)
  }

  useEffect(() => {
    if (!value) {
      return
    }

    setInputValue(value)
  }, [value])

  return (
    <Input
      data-testid="inputName"
      name="inputName"
      autoComplete="off"
      label={label ? label : formatMessage(core.fullName)}
      placeholder={placeholder ? placeholder : formatMessage(core.fullName)}
      errorMessage={errorMessage}
      hasError={errorMessage !== undefined}
      onChange={handleChange}
      onBlur={handleBlur}
      value={inputValue}
    />
  )
}

export default InputName
