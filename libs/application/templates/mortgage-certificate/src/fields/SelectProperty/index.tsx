import React, { FC, useState } from 'react'
import { FieldBaseProps } from '@island.is/application/types'
import { Box, ErrorMessage } from '@island.is/island-ui/core'
import { PropertyTypeSelectField } from './PropertyTypeSelectField'
import { useLocale } from '@island.is/localization'
import { PropertyTypes } from '../../lib/constants'
import { PropertyTypeSearchField } from './PropertyTypeSearchField'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { MortgageCertificate } from '../../lib/dataSchema'
import { CheckedProperties } from './CheckedProperties'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { error } from '../../lib/messages'
import { SelectedProperty } from '../../shared'

export const SelectProperty: FC<React.PropsWithChildren<FieldBaseProps>> = (
  props,
) => {
  const { application, field, errors } = props
  const { control } = useFormContext<MortgageCertificate>()
  const { formatMessage } = useLocale()
  const [propertyType, setPropertyType] = useState<PropertyTypes | undefined>(
    getValueViaPath(
      application.answers,
      `${field.id}.propertyType`,
    ) as PropertyTypes,
  )
  const { fields, append, remove } = useFieldArray({
    name: 'selectedProperties.properties',
    control,
  })

  const handleAddProperty = (property: SelectedProperty, index: number) =>
    index >= 0
      ? handleRemoveProperty(index)
      : append({
          propertyNumber: property.propertyNumber,
          propertyName: property.propertyName,
          propertyType: propertyType?.toString() ?? '',
        })

  const handleRemoveProperty = (index: number) => remove(index)

  return (
    <>
      <PropertyTypeSelectField
        {...props}
        setPropertyType={setPropertyType}
        propertyType={propertyType}
      />
      <PropertyTypeSearchField
        {...props}
        propertyType={propertyType}
        checkedProperties={fields}
        setCheckedProperties={handleAddProperty}
      />
      {errors &&
        getErrorViaPath(errors, `${field.id}.properties`) &&
        fields.length === 0 && (
          <Box paddingTop={2} paddingBottom={2}>
            <ErrorMessage>
              {formatMessage(error.errorNoSelectedProperty)}
            </ErrorMessage>
          </Box>
        )}
      {!!fields.length && (
        <CheckedProperties
          {...props}
          properties={fields}
          handleRemoveProperty={handleRemoveProperty}
        />
      )}
    </>
  )
}
