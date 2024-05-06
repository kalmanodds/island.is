import React from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Box, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import { SectionHeading } from '@island.is/judicial-system-web/src/components'
import { useContextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import {
  CourtCaseNumber,
  DefendantInfo,
  TableSkeleton,
} from '@island.is/judicial-system-web/src/components/Table'
import Table from '@island.is/judicial-system-web/src/components/Table/Table'
import TableInfoContainer from '@island.is/judicial-system-web/src/components/Table/TableInfoContainer/TableInfoContainer'
import TagCaseState, {
  mapIndictmentCaseStateToTagVariant,
} from '@island.is/judicial-system-web/src/components/TagCaseState/TagCaseState'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './CasesForReview.strings'

interface CasesForReviewTableProps {
  loading: boolean

  cases: CaseListEntry[]
}

const CasesForReview: React.FC<CasesForReviewTableProps> = ({
  loading,

  cases,
}) => {
  const { formatMessage } = useIntl()
  const { openCaseInNewTabMenuItem } = useContextMenu()

  return (
    <>
      <SectionHeading title={formatMessage(strings.title)} />
      <AnimatePresence initial={false}>
        <Box marginBottom={[5, 5, 12]}>
          {loading ? (
            <TableSkeleton />
          ) : cases.length > 0 ? (
            <Table
              thead={[
                {
                  title: formatMessage(tables.caseNumber),
                },
                {
                  title: capitalize(
                    formatMessage(core.defendant, { suffix: 'i' }),
                  ),
                  sortable: { isSortable: true, key: 'defendant' },
                },
                { title: formatMessage(tables.state) },
                { title: formatMessage(tables.prosecutorName) },
                { title: formatMessage(tables.deadline) },
              ]}
              data={cases}
              generateContextMenuItems={(row: CaseListEntry) => {
                return [openCaseInNewTabMenuItem(row.id)]
              }}
              columns={[
                {
                  cell: (row: CaseListEntry) => (
                    <CourtCaseNumber
                      courtCaseNumber={row.courtCaseNumber ?? ''}
                      policeCaseNumbers={row.policeCaseNumbers ?? []}
                      appealCaseNumber={row.appealCaseNumber ?? ''}
                    />
                  ),
                },
                {
                  cell: (row: CaseListEntry) => (
                    <DefendantInfo defendants={row.defendants} />
                  ),
                },
                {
                  cell: (row: CaseListEntry) => (
                    <TagCaseState
                      caseState={row.state}
                      customMapCaseStateToTag={
                        mapIndictmentCaseStateToTagVariant
                      }
                    />
                  ),
                },
                {
                  cell: (row: CaseListEntry) => (
                    <Text>{row.prosecutor?.name}</Text>
                  ),
                },
                {
                  cell: () => <Text>-</Text>, //TODO: Add deadline
                },
              ]}
            />
          ) : (
            <TableInfoContainer
              title={formatMessage(strings.infoContainerTitle)}
              message={formatMessage(strings.infoContainerMessage)}
            />
          )}
        </Box>
      </AnimatePresence>
    </>
  )
}

export default CasesForReview
