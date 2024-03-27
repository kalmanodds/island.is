/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useState, useCallback, useEffect } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { InputController } from '@island.is/shared/form-fields'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, GridRow, Button, Input } from '@island.is/island-ui/core'
import { Answers } from '../../types'
import * as styles from '../styles.css'
import { getErrorViaPath } from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import DoubleColumnRow from '../../components/DoubleColumnRow'
import {
  getEstateDataFromApplication,
  valueToNumber,
} from '../../lib/utils/helpers'
import { InheritanceReportAsset } from '@island.is/clients/syslumenn'

type OtherAssetsRepeaterProps = {
  field: {
    props: {
      fields: Array<object>
      repeaterButtonText: string
    }
  }
}

export const OtherAssetsRepeater: FC<
  React.PropsWithChildren<FieldBaseProps<Answers> & OtherAssetsRepeaterProps>
> = ({ application, field, errors }) => {
  const { id, props } = field

  const getDefaultValue = (
    fieldName: keyof InheritanceReportAsset,
    index = 0,
  ) =>
    getEstateDataFromApplication(application)?.inheritanceReportInfo
      ?.otherAssets?.[index]?.[fieldName] ?? ''

  const { fields, append, remove } = useFieldArray<any>({
    name: id,
  })

  const { setValue, getValues } = useFormContext()
  const { formatMessage } = useLocale()

  const [total, setTotal] = useState(0)
  const calculateTotal = useCallback(() => {
    const values = getValues(id)
    if (!values) {
      return
    }

    const total = values.reduce((acc: number, current: any) => {
      const value = valueToNumber(current?.value)

      return Number(acc) + value
    }, 0)

    const addTotal = id.replace('data', 'total')
    setValue(addTotal, total)
    setTotal(total)
  }, [getValues, id, setValue])

  useEffect(() => {
    calculateTotal()
  }, [calculateTotal])

  const handleAddRepeaterFields = () => {
    const values = props.fields.map((field: object) => {
      return Object.values(field)[1]
    })

    const repeaterFields: Record<string, string> = values.reduce(
      (acc: Record<string, unknown>, elem: string) => {
        acc[elem] = ''

        return acc
      },
      {},
    )

    append(repeaterFields)
  }

  return (
    <Box>
      {fields.map((repeaterField: any, mainIndex) => {
        const fieldIndex = `${id}[${mainIndex}]`

        return (
          <Box position="relative" key={repeaterField.id} marginTop={4}>
            <Box position="absolute" className={styles.removeFieldButtonSingle}>
              <Button
                variant="ghost"
                size="small"
                circle
                icon="remove"
                onClick={() => {
                  remove(mainIndex)
                  calculateTotal()
                }}
              />
            </Box>
            <GridRow>
              {props.fields.map((field: any) => {
                const fieldId = `${fieldIndex}.${field.id}`
                const err = errors && getErrorViaPath(errors, fieldId)
                const defaultValue = getDefaultValue(field, mainIndex)

                return (
                  <DoubleColumnRow
                    span={
                      field.width === 'full' ? ['1/1', '1/1'] : ['1/1', '1/2']
                    }
                    paddingBottom={2}
                    key={field.id}
                  >
                    <InputController
                      id={`${fieldIndex}.${field.id}`}
                      name={`${fieldIndex}.${field.id}`}
                      defaultValue={
                        repeaterField[field.id]
                          ? repeaterField[field.id]
                          : defaultValue
                      }
                      format={field.format}
                      label={formatMessage(field.title)}
                      placeholder={
                        field.placeholder
                          ? formatMessage(field.placeholder)
                          : ''
                      }
                      backgroundColor={field.color ? field.color : 'blue'}
                      currency={field.currency}
                      readOnly={field.readOnly}
                      type={field.type}
                      textarea={field.variant}
                      rows={field.rows}
                      required={field.required}
                      error={err}
                      onChange={() => {
                        calculateTotal()
                      }}
                    />
                  </DoubleColumnRow>
                )
              })}
            </GridRow>
          </Box>
        )
      })}
      <Box marginTop={3}>
        <Button
          variant="text"
          icon="add"
          iconType="outline"
          onClick={handleAddRepeaterFields}
          size="small"
        >
          {formatMessage(props.repeaterButtonText)}
        </Button>
      </Box>
      {!!fields.length && (
        <Box marginTop={5}>
          <GridRow>
            <DoubleColumnRow
              right={
                <Input
                  id={`${id}.total`}
                  name={`${id}.total`}
                  value={formatCurrency(String(valueToNumber(total)))}
                  label={formatMessage(m.total)}
                  backgroundColor="white"
                  readOnly
                />
              }
            />
          </GridRow>
        </Box>
      )}
    </Box>
  )
}

export default OtherAssetsRepeater
