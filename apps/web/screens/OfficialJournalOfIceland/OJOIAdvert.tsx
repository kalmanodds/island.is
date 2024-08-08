import { useIntl } from 'react-intl'

import { Box, Button, Link, Stack, Text } from '@island.is/island-ui/core'
import { Locale } from '@island.is/shared/types'
import {
  ContentLanguage,
  CustomPageUniqueIdentifier,
  OfficialJournalOfIcelandAdvertResponse,
  Query,
  QueryGetOrganizationArgs,
  QueryOfficialJournalOfIcelandAdvertArgs,
} from '@island.is/web/graphql/schema'
import { useLinkResolver } from '@island.is/web/hooks'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'

import {
  formatDate,
  OJOIAdvertDisplay,
  OJOIWrapper,
} from '../../components/OfficialJournalOfIceland'
import {
  CustomScreen,
  withCustomPageWrapper,
} from '../CustomPage/CustomPageWrapper'
import { GET_ORGANIZATION_QUERY } from '../queries'
import { ADVERT_QUERY } from '../queries/OfficialJournalOfIceland'
import { m } from './messages'

const OJOIAdvertPage: CustomScreen<OJOIAdvertProps> = ({
  advert,
  locale,
  organization,
}) => {
  const { formatMessage } = useIntl()
  const { linkResolver } = useLinkResolver()

  const baseUrl = linkResolver('ojoihome', [], locale).href
  const searchUrl = linkResolver('ojoisearch', [], locale).href

  const breadcrumbItems = [
    {
      title: 'Ísland.is',
      href: linkResolver('homepage', [], locale).href,
    },
    {
      title: organization?.title ?? '',
      href: baseUrl,
    },
    {
      title: formatMessage(m.advert.title),
    },
  ]

  return (
    <OJOIWrapper
      pageTitle={advert.title}
      hideTitle
      organization={organization ?? undefined}
      pageDescription={formatMessage(m.advert.description)}
      pageFeaturedImage={formatMessage(m.home.featuredImage)}
      breadcrumbItems={breadcrumbItems}
      goBackUrl={searchUrl}
      sidebarContent={
        <Stack space={[2]}>
          <Box background="blue100" padding={[2, 2, 3]} borderRadius="large">
            <Stack space={[1, 1, 2]}>
              <Text variant="h4">{formatMessage(m.advert.sidebarTitle)}</Text>

              <Box>
                <Text variant="h5">
                  {formatMessage(m.advert.sidebarDepartment)}
                </Text>
                <Text variant="small">{advert.department.title}</Text>
              </Box>

              <Box>
                <Text variant="h5">
                  {formatMessage(m.advert.sidebarInstitution)}
                </Text>
                <Text variant="small">{advert.involvedParty.title}</Text>
              </Box>

              <Box>
                <Text variant="h5">
                  {formatMessage(m.advert.sidebarCategory)}
                </Text>
                <Text variant="small">
                  {advert.categories.map((c) => c.title).join(', ')}
                </Text>
              </Box>

              <Box>
                <Text variant="h5">
                  {formatMessage(m.advert.signatureDate)}
                </Text>
                <Text variant="small">
                  {formatDate(advert.signatureDate, 'dd. MMMM yyyy')}
                </Text>
              </Box>

              <Box>
                <Text variant="h5">
                  {formatMessage(m.advert.publicationDate)}
                </Text>
                <Text variant="small">
                  {formatDate(advert.publicationDate, 'dd. MMMM yyyy')}
                </Text>
              </Box>
            </Stack>
          </Box>

          {advert.document.pdfUrl && (
            <Box
              background="blueberry100"
              padding={[2, 2, 3]}
              borderRadius="large"
            >
              <Stack space={[1, 1, 2]}>
                <Box href={advert.document.pdfUrl} component={Link}>
                  <Button
                    variant="text"
                    as="span"
                    icon="download"
                    iconType="outline"
                    size="small"
                  >
                    {formatMessage(m.advert.getPdf)}
                  </Button>
                </Box>
              </Stack>
            </Box>
          )}
        </Stack>
      }
    >
      <OJOIAdvertDisplay
        advertNumber={advert.publicationNumber.full}
        signatureDate={formatDate(advert.signatureDate, 'dd. MMMM yyyy')}
        advertType={advert.type.title}
        advertSubject={advert.subject}
        advertText={advert.document.html}
        isLegacy={advert.document.isLegacy ?? false}
      />
    </OJOIWrapper>
  )
}

interface OJOIAdvertProps {
  advert: OfficialJournalOfIcelandAdvertResponse['advert']
  locale: Locale
  organization?: Query['getOrganization']
}

const OJOIAdvert: CustomScreen<OJOIAdvertProps> = ({
  advert,
  locale,
  organization,
  customPageData,
}) => {
  return (
    <OJOIAdvertPage
      advert={advert}
      locale={locale}
      organization={organization}
      customPageData={customPageData}
    />
  )
}

OJOIAdvert.getProps = async ({
  apolloClient,
  locale,
  query,
  customPageData,
}) => {
  const organizationSlug = 'stjornartidindi'

  const [
    {
      data: { officialJournalOfIcelandAdvert },
    },
    {
      data: { getOrganization },
    },
  ] = await Promise.all([
    apolloClient.query<Query, QueryOfficialJournalOfIcelandAdvertArgs>({
      query: ADVERT_QUERY,
      variables: {
        params: {
          id: query.nr as string,
        },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationArgs>({
      query: GET_ORGANIZATION_QUERY,
      variables: {
        input: {
          slug: organizationSlug,
          lang: locale as ContentLanguage,
        },
      },
    }),
  ])

  if (!getOrganization?.hasALandingPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  if (!officialJournalOfIcelandAdvert?.advert) {
    throw new CustomNextError(404, 'OJOI advert not found')
  }

  return {
    advert: officialJournalOfIcelandAdvert.advert,
    organization: getOrganization,
    locale: locale as Locale,
    showSearchInHeader: false,
    themeConfig: {
      footerVersion: 'organization',
    },
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.OfficialJournalOfIceland,
    OJOIAdvert,
  ),
)
