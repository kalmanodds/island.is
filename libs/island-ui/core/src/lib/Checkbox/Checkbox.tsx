import React, { useState } from 'react'
import cn from 'classnames'
import { Text } from '../Text/Text'
import { Icon } from '../IconRC/Icon'
import { Tooltip } from '../Tooltip/Tooltip'
import { Box } from '../Box/Box'
import { InputBackgroundColor } from '../Input/types'
import * as styles from './Checkbox.css'
import { TestSupport } from '@island.is/island-ui/utils'

export interface CheckboxProps {
  name?: string
  id?: string
  label?: React.ReactNode
  checked?: boolean
  disabled?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  tooltip?: React.ReactNode
  hasError?: boolean
  errorMessage?: string
  value?: string
  defaultValue?: string
  defaultChecked?: boolean
  strong?: boolean
  filled?: boolean
  large?: boolean
  backgroundColor?: InputBackgroundColor
  labelVariant?: 'default' | 'small' | 'medium'
  /** subLabel can only be used if the 'large' prop set to true */
  subLabel?: React.ReactNode
}

interface AriaError {
  'aria-invalid': boolean
  'aria-describedby': string
}

export const Checkbox = ({
  label,
  subLabel,
  labelVariant = 'default',
  name,
  id = name,
  disabled,
  onChange,
  tooltip,
  hasError,
  errorMessage,
  value: valueFromProps,
  defaultValue,
  checked: checkedFromProps,
  defaultChecked,
  large,
  strong,
  backgroundColor,
  dataTestId,
  filled = false,
}: CheckboxProps & TestSupport) => {
  const errorId = `${id}-error`
  const ariaError = hasError
    ? {
        'aria-invalid': true,
        'aria-describedby': errorId,
      }
    : {}

  const background =
    backgroundColor && backgroundColor === 'blue' ? 'blue100' : undefined

  // If a defaultValue or defaultCheck is specified, we will use it as our initial state.
  const [internalState, setInternalState] = useState({
    value: defaultValue !== undefined ? defaultValue : '',
    checked: defaultChecked !== undefined ? defaultChecked : false,
  })

  // We need to know whether the component is controlled or not.
  const isValueControlled = valueFromProps !== undefined
  const isCheckedControlled = checkedFromProps !== undefined
  // Internally, we need to deal with some value. Depending on whether
  // the component is controlled or not, that value comes from its
  // props or from its internal state.
  const value = isValueControlled ? valueFromProps : internalState.value
  const checked = isCheckedControlled ? checkedFromProps : internalState.checked

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isValueControlled || !isCheckedControlled) {
      // If the component is not controlled, we need to update its internal state.
      setInternalState({
        value:
          // If the value is empty, we need to convert checked to a boolean representation of a string.
          // This is to make sure that input value can be extracted from the query string
          event.target.value === ''
            ? event.target.checked.toString()
            : event.target.value,
        checked: event.target.checked,
      })
    }

    onChange?.(event)
  }

  return (
    <Box
      className={cn(styles.container, large, {
        [styles.large]: large,
        [styles.filled]: filled,
      })}
      background={background}
    >
      <input
        className={styles.input}
        type="checkbox"
        name={name}
        disabled={disabled}
        id={id}
        data-testid={dataTestId}
        onChange={onChangeHandler}
        value={value}
        checked={checked}
        {...(ariaError as AriaError)}
      />
      <label
        className={cn(styles.label, {
          [styles.checkboxLabelDisabled]: disabled,
          [styles.largeLabel]: large,
        })}
        htmlFor={id}
      >
        <div
          className={cn(styles.checkbox, {
            [styles.checkboxChecked]: checked,
            [styles.checkboxError]: hasError,
            [styles.checkboxDisabled]: disabled,
          })}
        >
          <Icon
            icon="checkmark"
            color={checked ? 'white' : 'transparent'}
            ariaHidden
          />
        </div>
        <span className={styles.labelText}>
          <Text
            as="span"
            variant={labelVariant}
            fontWeight={checked || strong ? 'semiBold' : 'light'}
          >
            {label}
          </Text>
          <div
            aria-hidden="true"
            className={styles.fixJumpingContentFromFontWeightToggle}
          >
            <Text as="span" variant={labelVariant} fontWeight="semiBold">
              {label}
            </Text>
          </div>
          {subLabel && large && (
            <Text
              as="span"
              marginTop="smallGutter"
              fontWeight="regular"
              variant="small"
            >
              {subLabel}
            </Text>
          )}
        </span>
        {tooltip && (
          <div
            className={cn(styles.tooltipContainer, {
              [styles.tooltipLargeContainer]: large,
            })}
          >
            <Tooltip text={tooltip} />
          </div>
        )}
        {hasError && errorMessage && (
          <div
            id={errorId}
            className={styles.errorMessage}
            aria-live="assertive"
          >
            {errorMessage}
          </div>
        )}
      </label>
    </Box>
  )
}
