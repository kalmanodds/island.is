import {
  ActionCard,
  FilterInput,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Box,
  Text,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../lib/navigation'
import { m, parliamentaryMessages } from '../lib/messages'
import { useLoaderData, useNavigate } from 'react-router-dom'
import { SignatureCollectionPaths } from '../lib/paths'
import CompareLists from '../shared-components/compareLists'
import { ListsLoaderReturn } from '../loaders/AllLists.loader'

const ParliamentaryRoot = () => {
  const { formatMessage } = useLocale()

  const navigate = useNavigate()
  const { collection } = useLoaderData() as ListsLoaderReturn

  return (
    <GridContainer>
      <GridRow direction="row">
        <GridColumn
          span={['12/12', '5/12', '5/12', '3/12']}
          offset={['0', '7/12', '7/12', '0']}
        >
          <PortalNavigation
            navigation={signatureCollectionNavigation}
            title={formatMessage(m.signatureListsTitle)}
          />
        </GridColumn>
        <GridColumn
          paddingTop={[5, 5, 5, 0]}
          offset={['0', '0', '0', '1/12']}
          span={['12/12', '12/12', '12/12', '8/12']}
        >
          <IntroHeader
            title={formatMessage(parliamentaryMessages.signatureListsTitle)}
            intro={formatMessage(parliamentaryMessages.signatureListsIntro)}
            imgPosition="right"
            imgHiddenBelow="sm"
          />
          <Box width="half" marginBottom={8}>
            <FilterInput
              name="searchSignee"
              value={''}
              onChange={() => console.log('search')}
              placeholder={formatMessage(m.searchInListPlaceholder)}
              backgroundColor="blue"
            />
          </Box>
          <Text variant="eyebrow" marginBottom={3}>
            {formatMessage(m.totalListResults) + ' ' + collection?.areas.length}
          </Text>
          <Stack space={3}>
            {collection?.areas.map((area) => (
              <ActionCard
                key={area.id}
                eyebrow={'Fjöldi lista: XXX'}
                heading={area.name}
                cta={{
                  label: formatMessage(m.viewConstituency),
                  variant: 'text',
                  onClick: () => {
                    navigate(
                      SignatureCollectionPaths.ParliamentaryConstituency.replace(
                        ':constituencyName',
                        area.name,
                      ),
                    )
                  },
                }}
              />
            ))}
          </Stack>
          <CompareLists collectionId={collection?.id} />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default ParliamentaryRoot
