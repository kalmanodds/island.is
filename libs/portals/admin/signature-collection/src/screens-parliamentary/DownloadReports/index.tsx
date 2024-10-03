import { useLocale } from '@island.is/localization'
import { ActionCard, Box, Button, Stack, Text } from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'
import { Modal } from '@island.is/react/components'
import {
  SignatureCollectionArea,
  SignatureCollectionAreaSummaryReport,
} from '@island.is/api/schema'
import { m } from '../../lib/messages'
import { usePDF } from '@react-pdf/renderer'
import MyPdfDocument from './MyPdfDocument'
import { SignatureCollectionAreaSummaryReportDocument } from './MyPdfDocument/areaSummary.generated'
import { useLazyQuery } from '@apollo/client'

export const DownloadReports = ({
  areas,
  collectionId,
}: {
  areas: SignatureCollectionArea[]
  collectionId: string
}) => {
  const { formatMessage } = useLocale()
  const [modalDownloadReportsIsOpen, setModalDownloadReportsIsOpen] =
    useState(false)

  const [runGetSummaryReport, { data }] = useLazyQuery(
    SignatureCollectionAreaSummaryReportDocument,
  )

  const [document, updateDocument] = usePDF({
    document: (
      <MyPdfDocument
        report={
          data?.signatureCollectionAreaSummaryReport as SignatureCollectionAreaSummaryReport
        }
      />
    ),
  })

  // Update document with after correct data is fetched
  useEffect(() => {
    if (data?.signatureCollectionAreaSummaryReport) {
      updateDocument()
    }
  }, [data])

  // Open the document in a new tab when it has been generated
  useEffect(() => {
    if (!document.loading && document.url) {
      window.open(document.url, '_blank')
    }
  }, [document.loading, document.url])

  return (
    <Box>
      <Button
        icon="download"
        iconType="outline"
        variant="utility"
        size="small"
        onClick={() => setModalDownloadReportsIsOpen(true)}
      >
        {formatMessage(m.downloadReports)}
      </Button>
      <Modal
        id="downloadReports"
        isVisible={modalDownloadReportsIsOpen}
        title={formatMessage(m.downloadReports)}
        label={''}
        onClose={() => {
          setModalDownloadReportsIsOpen(false)
        }}
        closeButtonLabel={''}
      >
        <Text>{formatMessage(m.downloadReportsDescription)}</Text>
        <Box marginY={5}>
          <Stack space={3}>
            {areas.map((area) => (
              <ActionCard
                key={area.id}
                heading={formatMessage(area.name)}
                headingVariant="h4"
                backgroundColor="blue"
                cta={{
                  label: formatMessage(m.downloadButton),
                  variant: 'text',
                  icon: 'download',
                  iconType: 'outline',
                  onClick: () => {
                    runGetSummaryReport({
                      variables: {
                        input: {
                          areaId: area.id,
                          collectionId: collectionId,
                        },
                      },
                    })
                  },
                }}
              />
            ))}
          </Stack>
        </Box>
      </Modal>
    </Box>
  )
}

export default DownloadReports
