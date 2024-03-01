import { FieldBaseProps, StaticText } from '@island.is/application/types'
import { GrindavikHousingBuyout } from '../../lib/dataSchema'
import {
  Box,
  Divider,
  GridColumn,
  GridRow,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { applicantInformationMessages } from '@island.is/application/ui-forms'
import { useLocale } from '@island.is/localization'
import { format as formatNationalId } from 'kennitala'
import { formatText } from '@island.is/application/core'
import {
  formatPhoneNumber,
  removeCountryCode,
} from '@island.is/application/ui-components'

const KeyValue = ({ label, value }: { label: StaticText; value: string }) => {
  const { formatMessage } = useLocale()
  return (
    <Box>
      <Text variant="h4" as="h4">
        {formatMessage(label)}
      </Text>
      <Text>{value}</Text>
    </Box>
  )
}

export const AdditionalOwnersOverview = ({
  application,
  field,
}: FieldBaseProps<GrindavikHousingBuyout>) => {
  const additionalOwners = application.answers.additionalOwners ?? []
  const { formatMessage } = useLocale()

  return (
    <Box>
      <Box marginBottom={3}>
        <Text variant="h3" marginBottom={3}>
          {formatText(field.title, application, formatMessage)}
        </Text>
        <Stack space={6} dividers>
          {additionalOwners.map((owner, index) => (
            <Box key={`${field.id}-${index}`}>
              <GridRow rowGap={3}>
                <GridColumn span="1/2">
                  <KeyValue
                    label={applicantInformationMessages.labels.name}
                    value={owner.name ?? ''}
                  />
                </GridColumn>
                <GridColumn span="1/2">
                  <KeyValue
                    label={applicantInformationMessages.labels.nationalId}
                    value={formatNationalId(owner.nationalId ?? '')}
                  />
                </GridColumn>
                <GridColumn span="1/2">
                  <KeyValue
                    label={applicantInformationMessages.labels.email}
                    value={owner.email ?? ''}
                  />
                </GridColumn>
                <GridColumn span="1/2">
                  <KeyValue
                    label={applicantInformationMessages.labels.tel}
                    value={formatPhoneNumber(
                      removeCountryCode(owner.phone ?? ''),
                    )}
                  />
                </GridColumn>
              </GridRow>
            </Box>
          ))}
        </Stack>
      </Box>
      <Box paddingY={2}>
        <Divider />
      </Box>
    </Box>
  )
}
