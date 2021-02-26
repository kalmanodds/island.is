import React, { FC, useMemo } from 'react'
import {
  FieldBaseProps,
  formatText,
  SelectField,
  buildFieldOptions,
} from '@island.is/application/core'
import { Box } from '@island.is/island-ui/core'
import {
  SelectController,
  FieldDescription,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { useDefaultValue } from '../useDefaultValue'

interface Props extends FieldBaseProps {
  field: SelectField
}
const SelectFormField: FC<Props> = ({ application, error, field }) => {
  const {
    id,
    title,
    description,
    options,
    placeholder,
    disabled,
    onSelect,
    backgroundColor,
  } = field
  const { formatMessage } = useLocale()
  const finalOptions = useMemo(() => buildFieldOptions(options, application), [
    options,
    application,
  ])
  return (
    <div>
      {description && (
        <FieldDescription
          description={formatText(description, application, formatMessage)}
        />
      )}

      <Box paddingTop={2}>
        <SelectController
          defaultValue={useDefaultValue(field, application)}
          label={formatText(title, application, formatMessage)}
          name={id}
          disabled={disabled}
          error={error}
          id={id}
          backgroundColor={backgroundColor}
          options={finalOptions.map(({ label, tooltip, ...o }) => ({
            ...o,
            label: formatText(label, application, formatMessage),
            ...(tooltip && {
              tooltip: formatText(tooltip, application, formatMessage),
            }),
          }))}
          placeholder={
            placeholder !== undefined
              ? formatText(placeholder as string, application, formatMessage)
              : undefined
          }
          onSelect={onSelect}
        />
      </Box>
    </div>
  )
}

export default SelectFormField
