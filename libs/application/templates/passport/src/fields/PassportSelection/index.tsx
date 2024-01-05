import { FC } from 'react'
import { getErrorViaPath } from '@island.is/application/core'
import {
  FieldBaseProps,
  FieldComponents,
  FieldTypes,
  NationalRegistryIndividual,
  TagVariant,
} from '@island.is/application/types'
import { RadioFormField } from '@island.is/application/ui-fields'
import { Box, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import format from 'date-fns/format'
import { useFormContext } from 'react-hook-form'
import { m } from '../../lib/messages'
import {
  IdentityDocument,
  IdentityDocumentChild,
  IdentityDocumentData,
} from '../../lib/constants'

export type Tag = {
  label: string
  variant?: TagVariant | undefined
  outlined?: boolean | undefined
}

export const PassportSelection: FC<React.PropsWithChildren<FieldBaseProps>> = ({
  field,
  application,
}) => {
  const { id } = field
  const { formatMessage } = useLocale()
  const {
    setValue,
    formState: { errors },
  } = useFormContext()
  const userPassportRadio = `${id}.userPassport`
  const childPassportRadio = `${id}.childPassport`
  const fieldErrors = getErrorViaPath(errors, userPassportRadio)
  const identityDocumentData = application.externalData.identityDocument
    .data as IdentityDocumentData

  const individual = application.externalData.nationalRegistry
    .data as NationalRegistryIndividual

  const domicileCode = individual?.address?.municipalityCode

  type TagCheck = {
    tag: Tag
    isDisabled: boolean
  }

  const tag = (
    identityDocument: IdentityDocument,
    isChild: boolean,
  ): TagCheck => {
    const today = new Date()
    const expirationDate = new Date(identityDocument?.expirationDate)
    const todayPlus6Months = new Date(
      new Date().setMonth(new Date().getMonth() + 6),
    )

    let tagObject = {} as Tag
    let isDisabled = false

    if ((!domicileCode || domicileCode.substring(0, 2) === '99') && !isChild) {
      isDisabled = true
      tagObject = {
        label: formatMessage(m.incorrectDomicileTage),
        variant: 'red',
        outlined: true,
      }
    } else if (!identityDocument) {
      tagObject = {
        label: formatMessage(m.noPassport),
        variant: 'blue',
        outlined: true,
      }
    } else if (today > expirationDate) {
      tagObject = {
        label: formatMessage(m.expiredTag),
        variant: 'red',
        outlined: true,
      }
    } else if (todayPlus6Months > expirationDate) {
      tagObject = {
        label:
          formatMessage(m.validTag) +
          ' ' +
          format(new Date(expirationDate), 'dd.MM.yy'),
        variant: 'red',
        outlined: true,
      }
    } else if (todayPlus6Months < expirationDate) {
      isDisabled = true
      tagObject = {
        label:
          formatMessage(m.validTag) +
          ' ' +
          format(new Date(expirationDate), 'dd.MM.yy'),
        variant: 'mint',
        outlined: true,
      }
    } else if (identityDocument.status === 'ISSUED') {
      isDisabled = true
      tagObject = {
        label: formatMessage(m.orderedTag),
        variant: 'purple',
        outlined: true,
      }
    }

    return { tag: tagObject, isDisabled }
  }

  return (
    <Box>
      <RadioFormField
        error={fieldErrors}
        application={application}
        field={{
          id: userPassportRadio,
          title: '',
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          children: undefined,
          backgroundColor: 'white',
          defaultValue: '',
          options: [
            {
              label: (application.externalData.nationalRegistry.data as any)
                ?.fullName,
              value: '1',
              subLabel: identityDocumentData.userPassport
                ? formatMessage(m.passportNumber) +
                  ' ' +
                  identityDocumentData.userPassport?.subType +
                  identityDocumentData?.userPassport?.number
                : '',
              tag: tag(identityDocumentData.userPassport, false).tag,
              disabled:
                tag(identityDocumentData.userPassport, false).tag.label ===
                  m.orderedTag.defaultMessage ||
                tag(identityDocumentData.userPassport, false).isDisabled,
            },
          ],
          onSelect: () => {
            setValue(childPassportRadio, '')
          },
        }}
      />
      {identityDocumentData.childPassports.length > 0 && (
        <Text variant="h3" marginTop={2}>
          {formatMessage(m.children)}
        </Text>
      )}
      <RadioFormField
        error={fieldErrors}
        application={application}
        field={{
          space: 'smallGutter',
          id: childPassportRadio,
          title: '',
          type: FieldTypes.RADIO,
          component: FieldComponents.RADIO,
          children: undefined,
          backgroundColor: 'white',
          defaultValue: '',
          options: identityDocumentData.childPassports.map(
            (child: IdentityDocumentChild) => {
              return {
                label: child.childName,
                value: child.childNationalId,
                subLabel: child.passports?.length
                  ? formatMessage(m.passportNumber) +
                    ' ' +
                    child.passports[0].subType +
                    child.passports[0].number
                  : '',
                tag: child.passports
                  ? tag(child.passports?.[0], true).tag
                  : undefined,
                disabled: child.passports
                  ? tag(child.passports?.[0], true).isDisabled
                  : false,
              }
            },
          ),
          onSelect: () => {
            setValue(userPassportRadio, '')
          },
        }}
      />
    </Box>
  )
}
