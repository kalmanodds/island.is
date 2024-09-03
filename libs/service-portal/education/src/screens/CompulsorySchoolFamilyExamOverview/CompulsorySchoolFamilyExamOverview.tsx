import { Box, Divider, Stack, Text } from '@island.is/island-ui/core'
import { useLocale, useNamespaces } from '@island.is/localization'
import {
  ActionCard,
  FootNote,
  InfoLine,
  InfoLineStack,
  IntroHeader,
  MENNTAMALASTOFNUN_SLUG,
  m,
} from '@island.is/service-portal/core'
import { compulsoryMessages } from '../../lib/messages'
import { useFamilySchoolCareerQuery } from './CompulsorySchoolFamilyExamOverview.generated'
import { Problem } from '@island.is/react-spa/shared'

const CompulsorySchoolFamilyExamOverview = () => {
  useNamespaces('sp.education-career')
  const { formatMessage } = useLocale()

  const { data, loading, error } = useFamilySchoolCareerQuery()

  const userCareer = data?.educationUserFamilyCompulsorySchoolCareer?.userCareer
  return (
    <Box>
      <IntroHeader
        title={m.educationCareer}
        intro={formatMessage(compulsoryMessages.compulsorySchoolIntro)}
        serviceProviderSlug={MENNTAMALASTOFNUN_SLUG}
        serviceProviderTooltip={formatMessage(m.mmsTooltip)}
      />
      {error && !loading && <Problem error={error} noBorder={false} />}
      {!error &&
        !loading &&
        !data?.educationUserFamilyCompulsorySchoolCareer && (
          <Problem
            type="no_data"
            noBorder={false}
            title={formatMessage(m.noData)}
            message={formatMessage(m.noDataFoundDetail)}
            imgSrc="./assets/images/sofa.svg"
          />
        )}
      {userCareer && (
        <Box marginBottom={10}>
          <Text variant="h3" marginBottom={3}>
            {userCareer.name}
          </Text>
          <ActionCard
            cta={{
              label: formatMessage({
                id: 'sp.education-career:education-more',
                defaultMessage: 'Skoða nánar',
              }),

              variant: 'text',
              size: 'small',
            }}
            tag={{
              label: 'Skoð nánar',
              variant: 'purple',
              outlined: false,
            }}
            heading={'bingi bango'}
            text={userCareer.examDateSpan ?? ''}
          />
        </Box>
      )}
      <FootNote serviceProviderSlug={MENNTAMALASTOFNUN_SLUG} />
    </Box>
  )
}

export default CompulsorySchoolFamilyExamOverview
