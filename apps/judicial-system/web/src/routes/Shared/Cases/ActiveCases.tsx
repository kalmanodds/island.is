import React, { FC } from 'react'
import { useIntl } from 'react-intl'

import { capitalize } from '@island.is/judicial-system/formatters'
import { core, tables } from '@island.is/judicial-system-web/messages'
import { TagCaseState } from '@island.is/judicial-system-web/src/components'
import { useContextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import { contextMenu } from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu.strings'
import {
  ColumnCaseType,
  CourtCaseNumber,
  CourtDate,
  CreatedDate,
  DefendantInfo,
} from '@island.is/judicial-system-web/src/components/Table'
import Table from '@island.is/judicial-system-web/src/components/Table/Table'
import { CaseListEntry } from '@island.is/judicial-system-web/src/graphql/schema'

interface Props {
  cases: CaseListEntry[]
  onContextMenuDeleteClick: (id: string) => void
}

const ActiveCases: FC<Props> = (props) => {
  const { cases, onContextMenuDeleteClick } = props
  const { formatMessage } = useIntl()
  const { openCaseInNewTabMenuItem } = useContextMenu()

  return (
    <Table
      thead={[
        {
          title: formatMessage(tables.caseNumber),
        },
        {
          title: capitalize(formatMessage(core.defendant, { suffix: 'i' })),
          sortable: { isSortable: true, key: 'defendants' },
        },
        {
          title: formatMessage(tables.type),
        },
        {
          title: capitalize(formatMessage(tables.created, { suffix: 'i' })),
          sortable: { isSortable: true, key: 'created' },
        },
        { title: formatMessage(tables.state) },
        {
          title: formatMessage(tables.hearingArrangementDate),
          sortable: {
            isSortable: true,
            key: 'courtDate',
          },
        },
      ]}
      data={cases}
      generateContextMenuItems={(row) => {
        return [
          openCaseInNewTabMenuItem(row.id),
          {
            title: formatMessage(contextMenu.deleteCase),
            onClick: () => {
              onContextMenuDeleteClick(row.id)
            },
            icon: 'trash',
          },
        ]
      }}
      columns={[
        {
          cell: (row) => (
            <CourtCaseNumber
              courtCaseNumber={row.courtCaseNumber ?? ''}
              policeCaseNumbers={row.policeCaseNumbers ?? []}
              appealCaseNumber={row.appealCaseNumber ?? ''}
            />
          ),
        },
        {
          cell: (row) => <DefendantInfo defendants={row.defendants} />,
        },
        {
          cell: (row) => <ColumnCaseType type={row.type} />,
        },
        {
          cell: (row) => <CreatedDate created={row.created} />,
        },
        {
          cell: (row) => (
            <TagCaseState
              caseState={row.state}
              isCourtRole={true}
              indictmentDecision={row.indictmentDecision}
            />
          ),
        },
        {
          cell: (row) => (
            <CourtDate
              courtDate={row.courtDate}
              postponedIndefinitelyExplanation={
                row.postponedIndefinitelyExplanation
              }
              courtSessionType={row.courtSessionType}
            />
          ),
        },
      ]}
    />
  )
}

export default ActiveCases
