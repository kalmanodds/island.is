import format from 'date-fns/format'
import localeIS from 'date-fns/locale/is'
import capitalize from 'lodash/capitalize'
import round from 'lodash/round'

import type { Locale } from '@island.is/shared/types'

import { DEFAULT_XAXIS_FORMAT } from '../constants'
import { messages } from '../messages'

export const formatDate = (
  activeLocale: Locale,
  date: Date | string | number,
  dateFormat = DEFAULT_XAXIS_FORMAT,
) => {
  try {
    return capitalize(
      format(new Date(date), dateFormat, {
        locale: activeLocale === 'is' ? localeIS : undefined,
      }),
    )
  } catch {
    return ''
  }
}

export const formatValueForPresentation = (
  activeLocale: Locale,
  possiblyRawValue: number | string,
  reduceAndRoundValue = true,
  increasePrecisionBy = 0,
) => {
  if (possiblyRawValue === undefined) {
    return ''
  }

  try {
    if (
      typeof possiblyRawValue === 'number' ||
      !Number.isNaN(possiblyRawValue)
    ) {
      const value = Number(possiblyRawValue)

      let divider = 1
      let postfix = ''
      let precision = 0

      if (reduceAndRoundValue && value >= 1e6) {
        divider = 1e6
        postfix = messages[activeLocale].millionPostfix
        precision = 1 + increasePrecisionBy
      } else if (reduceAndRoundValue && value >= 1e4) {
        divider = 1e3
        postfix = messages[activeLocale].thousandPostfix
      }

      const v = round(value / divider, precision)

      return `${v.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${postfix}`
    }
  } catch {
    // pass
  }

  return possiblyRawValue?.toString()
}

export const formatPercentageForPresentation = (
  percentage: number,
  precision: number | undefined = undefined,
) => {
  return `${round(percentage * 100, precision ?? percentage < 0.1 ? 1 : 0)}%`
}

export const createTickFormatter =
  (activeLocale: Locale, xAxisValueType?: string, xAxisFormat?: string) =>
  (value: unknown) => {
    // Date is the default is value type is undefined
    if (!xAxisValueType || xAxisValueType === 'date') {
      return formatDate(activeLocale, value as Date, xAxisFormat || undefined)
    } else if (xAxisValueType === 'number') {
      return formatValueForPresentation(activeLocale, value as string | number)
    }

    return value as string
  }
