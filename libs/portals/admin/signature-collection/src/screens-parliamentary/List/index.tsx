import {
  Box,
  Breadcrumbs,
  GridColumn,
  GridContainer,
  GridRow,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { IntroHeader, PortalNavigation } from '@island.is/portals/core'
import { signatureCollectionNavigation } from '../../lib/navigation'
import { m } from '../../lib/messages'
import { useLoaderData } from 'react-router-dom'
import { ListStatus, SignatureCollectionList } from '@island.is/api/schema'
import { PaperSignees } from './paperSignees'
import { SignatureCollectionPaths } from '../../lib/paths'
import ActionExtendDeadline from '../../shared-components/extendDeadline'
import Signees from '../../shared-components/signees'
import ActionReviewComplete from '../../shared-components/completeReview'
import ListInfo from '../../shared-components/listInfoAlert'

const List = () => {
  const { formatMessage } = useLocale()
  const { list, listStatus } = useLoaderData() as {
    list: SignatureCollectionList
    listStatus: string
  }

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
          <Box marginBottom={3}>
            <Breadcrumbs
              items={[
                {
                  title: formatMessage('Yfirlit'),
                  href: `/stjornbord${SignatureCollectionPaths.ParliamentaryRoot}`,
                },
                {
                  title: list.area.name,
                  href: `/stjornbord${SignatureCollectionPaths.ParliamentaryConstituency.replace(
                    ':constituencyName',
                    list.area.name,
                  )}`,
                },
                { title: formatMessage(m.viewList) },
              ]}
            />
          </Box>
          <IntroHeader
            title={list?.title}
            imgPosition="right"
            imgHiddenBelow="sm"
          />
          <ListInfo
            message={
              listStatus === ListStatus.Extendable
                ? formatMessage(m.listStatusExtendableAlert)
                : listStatus === ListStatus.InReview
                ? formatMessage(m.listStatusInReviewAlert)
                : listStatus === ListStatus.Reviewed
                ? formatMessage(m.listStatusReviewedStatusAlert)
                : listStatus === ListStatus.Inactive
                ? formatMessage(m.listStatusReviewedStatusAlert)
                : formatMessage(m.listStatusActiveAlert)
            }
            type={listStatus === ListStatus.Reviewed ? 'success' : undefined}
          />
          <ActionExtendDeadline listId={list.id} endTime={list.endTime} />
          <Signees numberOfSignatures={list.numberOfSignatures ?? 0} />
          <PaperSignees listId={list.id} />
          <ActionReviewComplete listId={list.id} />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default List
