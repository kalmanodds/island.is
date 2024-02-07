import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import * as kennitala from 'kennitala'
import {
  Box,
  GridColumn,
  GridRow,
  Button,
  Text,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import intervalToDuration from 'date-fns/intervalToDuration'
import {
  GenericFormField,
  Application,
  YES,
} from '@island.is/application/types'
import { hasYes } from '@island.is/application/core'
import { Fragment, useEffect, useMemo } from 'react'
import { EstateMember, EstateTypes } from '../../types'
// import { LookupPerson } from '../LookupPerson'
import { ErrorValue } from '../../lib/constants'
import { LookupPerson } from '../LookupPerson'
import { HeirsAndPartitionRepeaterProps } from './types'

export const AdditionalHeir = ({
  field,
  customFields,
  index,
  remove,
  updateValues,
  fieldName,
  relationOptions,
  relationWithApplicantOptions,
  error,
  application,
}: {
  application: Application
  customFields: HeirsAndPartitionRepeaterProps['field']['props']['customFields']
  field: GenericFormField<EstateMember>
  index: number
  remove: (index?: number | number[] | undefined) => void
  updateValues: (updateIndex: string, value: number) => void
  fieldName: string
  relationOptions: { value: string; label: string }[]
  relationWithApplicantOptions: { value: string; label: string }[]
  error: Record<string, string>
}) => {
  const { formatMessage } = useLocale()
  const fieldIndex = `${fieldName}[${index}]`
  const nameField = `${fieldIndex}.name`
  const relationField = `${fieldIndex}.relation`
  const relationWithApplicantField = `${fieldIndex}.relationWithApplicant`
  const dateOfBirthField = `${fieldIndex}.dateOfBirth`
  const foreignCitizenshipField = `${fieldIndex}.foreignCitizenship`
  const initialField = `${fieldIndex}.initial`
  const enabledField = `${fieldIndex}.enabled`
  const phoneField = `${fieldIndex}.phone`
  const emailField = `${fieldIndex}.email`

  const advocatePhone = `${fieldIndex}.advocate.phone`
  const advocateEmail = `${fieldIndex}.advocate.email`

  const foreignCitizenship = useWatch({
    name: `${fieldIndex}.foreignCitizenship`,
    defaultValue: hasYes(field.foreignCitizenship) ? [YES] : '',
  })

  const { control, setValue, clearErrors, getValues } = useFormContext()

  const values = getValues()

  const currentHeir = useMemo(
    () => values?.heirs?.data?.[index],
    [values, index],
  )

  const hasForeignCitizenship = currentHeir?.foreignCitizenship?.[0] === YES
  const birthDate = currentHeir?.dateOfBirth

  const memberAge =
    hasForeignCitizenship && birthDate
      ? intervalToDuration({ start: new Date(birthDate), end: new Date() })
          ?.years
      : kennitala.info(currentHeir?.nationalId)?.age

  const hideContactInfo =
    kennitala.isPerson(currentHeir?.nationalId) &&
    memberAge !== undefined &&
    memberAge < 18

  useEffect(() => {
    clearErrors(nameField)
    clearErrors(relationField)
    clearErrors(dateOfBirthField)
    clearErrors(`${fieldIndex}.nationalId`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foreignCitizenship])

  const requiresAdvocate = memberAge !== undefined && memberAge < 18
  console.log(memberAge)

  return (
    <Box position="relative" key={field.id} marginTop={7}>
      <Controller
        name={initialField}
        control={control}
        defaultValue={field.initial || false}
        render={() => <input type="hidden" />}
      />
      <Controller
        name={enabledField}
        control={control}
        defaultValue={field.enabled || false}
        render={() => <input type="hidden" />}
      />
      <Box display={'flex'} justifyContent="spaceBetween">
        <Text variant="h4">{formatMessage(m.heir)}</Text>
        <Box>
          <Button
            variant="text"
            size="small"
            icon="trash"
            onClick={() => {
              remove(index)
            }}
          >
            {formatMessage(m.inheritanceDeleteMember)}
          </Button>
        </Box>
      </Box>
      {foreignCitizenship?.length ? (
        <GridRow>
          <GridColumn span={['1/1', '1/2']} paddingBottom={2} paddingTop={2}>
            <InputController
              key={nameField}
              id={nameField}
              name={nameField}
              defaultValue={field.name}
              backgroundColor="white"
              error={error?.name ?? undefined}
              label={formatMessage(m.inheritanceNameLabel)}
              required
            />
          </GridColumn>
          <GridColumn span={['1/1', '1/2']} paddingBottom={2} paddingTop={2}>
            <DatePickerController
              label={formatMessage(m.inheritanceDayOfBirthLabel)}
              placeholder={formatMessage(m.inheritanceDayOfBirthLabel)}
              id={dateOfBirthField}
              key={dateOfBirthField}
              name={dateOfBirthField}
              locale="is"
              maxDate={new Date()}
              minYear={1900}
              maxYear={new Date().getFullYear()}
              backgroundColor="blue"
              onChange={(d) => {
                setValue(dateOfBirthField, d)
              }}
              error={error?.dateOfBirth ?? undefined}
            />
          </GridColumn>
        </GridRow>
      ) : (
        <Box paddingY={2}>
          <LookupPerson
            field={{
              id: `${fieldIndex}`,
              props: {
                requiredNationalId: true,
              },
            }}
            error={error}
          />
        </Box>
      )}
      <GridRow>
        <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
          <SelectController
            key={relationField}
            id={relationField}
            name={relationField}
            label={formatMessage(m.inheritanceRelationLabel)}
            defaultValue={field.relation}
            options={relationOptions}
            error={error?.relation}
            backgroundColor="white"
            required
          />
        </GridColumn>
        {application.answers.selectedEstate ===
          EstateTypes.permitForUndividedEstate && (
          <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
            <SelectController
              key={relationWithApplicantField}
              id={relationWithApplicantField}
              name={relationWithApplicantField}
              label={formatMessage(m.inheritanceRelationWithApplicantLabel)}
              defaultValue={field.relationWithApplicant}
              options={relationWithApplicantOptions}
              error={error?.relationWithApplicant}
              backgroundColor="white"
              required={!field.initial}
            />
          </GridColumn>
        )}
        {!hideContactInfo && (
          <>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={emailField}
                name={emailField}
                label={formatMessage(m.email)}
                defaultValue={field.email || ''}
                backgroundColor="white"
                error={error?.email}
                required
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={phoneField}
                name={phoneField}
                label={formatMessage(m.phone)}
                defaultValue={field.phone || ''}
                backgroundColor="white"
                format={'###-####'}
                error={error?.phone}
                required
              />
            </GridColumn>
          </>
        )}
      </GridRow>

      <GridRow>
        {customFields.map((customField: any, customFieldIndex) => {
          const defaultValue = (currentHeir as any)?.[customField.id]

          return (
            <Fragment key={customFieldIndex}>
              {customField?.sectionTitle ? (
                <GridColumn span="1/1">
                  <Text variant="h5" marginBottom={2}>
                    {customField.sectionTitle}
                  </Text>
                </GridColumn>
              ) : null}

              {customField.id === 'relation' ? (
                <Fragment>
                  {currentHeir.initial && (
                    <GridColumn span="1/1" paddingBottom={2}>
                      <InputController
                        id={`${fieldIndex}.${customField.id}`}
                        name={`${fieldIndex}.${customField.id}`}
                        label={customField?.title}
                        readOnly
                        defaultValue={currentHeir.relation}
                        backgroundColor="blue"
                        disabled={!currentHeir.enabled}
                      />
                    </GridColumn>
                  )}
                  {application.answers.selectedEstate ===
                    EstateTypes.permitForUndividedEstate &&
                    currentHeir.relation !== 'Maki' && (
                      <GridColumn span="1/1" paddingBottom={2}>
                        <SelectController
                          id={`${fieldIndex}.relationWithApplicant`}
                          name={`${fieldIndex}.relationWithApplicant`}
                          label={formatMessage(
                            m.inheritanceRelationWithApplicantLabel,
                          )}
                          defaultValue={currentHeir.relationWithApplicant}
                          options={relationOptions}
                          error={error?.relationWithApplicant}
                          backgroundColor="blue"
                          disabled={!currentHeir.enabled}
                          required
                        />
                      </GridColumn>
                    )}
                </Fragment>
              ) : customField.id === 'heirsPercentage' ? (
                <GridColumn span={['1/2']} paddingBottom={2}>
                  <InputController
                    id={`${fieldIndex}.${customField.id}`}
                    name={`${fieldIndex}.${customField.id}`}
                    disabled={!currentHeir.enabled}
                    label={customField.title}
                    defaultValue={defaultValue ? defaultValue : '0'}
                    type="number"
                    suffix="%"
                    onChange={(
                      event: React.ChangeEvent<
                        HTMLInputElement | HTMLTextAreaElement
                      >,
                    ) => {
                      const val = parseInt(event.target.value, 10)
                      updateValues(fieldIndex, val)
                    }}
                    error={
                      error && error[index]
                        ? error[index][customField.id]
                        : undefined
                    }
                    required
                  />
                </GridColumn>
              ) : (
                <GridColumn span={['1/2']} paddingBottom={2}>
                  <InputController
                    id={`${fieldIndex}.${customField.id}`}
                    name={`${fieldIndex}.${customField.id}`}
                    disabled={!currentHeir.enabled}
                    defaultValue={defaultValue ? defaultValue : ''}
                    format={customField.format}
                    label={customField.title}
                    currency
                    readOnly
                    error={
                      error && error[index]
                        ? error[index][customField.id]
                        : undefined
                    }
                  />
                </GridColumn>
              )}
            </Fragment>
          )
        })}
      </GridRow>

      {/* ADVOCATE */}
      {(currentHeir?.nationalId || hasForeignCitizenship) && requiresAdvocate && (
        <Box
          marginTop={2}
          marginBottom={2}
          paddingY={5}
          paddingX={7}
          borderRadius="large"
          border="standard"
        >
          <GridRow>
            <GridColumn span={['1/1']} paddingBottom={2}>
              <Text variant="h4">
                {formatMessage(m.inheritanceAdvocateLabel)}
              </Text>
            </GridColumn>
            <GridColumn span={['1/1']} paddingBottom={2}>
              <LookupPerson
                nested
                field={{
                  id: `${fieldIndex}.advocate`,
                }}
                error={error}
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={advocatePhone}
                name={advocatePhone}
                label={formatMessage(m.phone)}
                backgroundColor="white"
                format="###-####"
                error={(error?.advocate as unknown as ErrorValue)?.phone}
                size="sm"
                required
              />
            </GridColumn>
            <GridColumn span={['1/1', '1/2']} paddingBottom={2}>
              <InputController
                id={advocateEmail}
                name={advocateEmail}
                label={formatMessage(m.email)}
                backgroundColor="white"
                error={(error?.advocate as unknown as ErrorValue)?.email}
                size="sm"
                required
              />
            </GridColumn>
          </GridRow>
        </Box>
      )}
      <GridColumn span="1/1" paddingBottom={2}>
        <Box width="half">
          <CheckboxController
            key={foreignCitizenshipField}
            id={foreignCitizenshipField}
            name={foreignCitizenshipField}
            defaultValue={field?.foreignCitizenship || []}
            options={[
              {
                label: formatMessage(m.inheritanceForeignCitizenshipLabel),
                value: YES,
              },
            ]}
            onSelect={(val) => {
              setValue(foreignCitizenshipField, val)
            }}
          />
        </Box>
      </GridColumn>
    </Box>
  )
}

export default AdditionalHeir
