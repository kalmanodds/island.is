import { useLocale } from '@island.is/localization'
import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useToggleListReviewMutation } from './toggleListReview.generated'
import { useRevalidator } from 'react-router-dom'
import { m } from '../../lib/messages'
import { ListStatus } from '../../lib/utils'

const ActionReviewComplete = ({
  listId,
  listStatus,
}: {
  listId: string
  listStatus: string
}) => {
  const { formatMessage } = useLocale()
  const [modalSubmitReviewIsOpen, setModalSubmitReviewIsOpen] = useState(false)
  const [toggleListReviewMutation, { loading }] = useToggleListReviewMutation()
  const { revalidate } = useRevalidator()
  const listReviewed = listStatus && listStatus === ListStatus.Reviewed
  const modalText = listReviewed
    ? formatMessage(m.confirmListReviewedToggleBack)
    : formatMessage(m.confirmListReviewed)

  const toggleReview = async () => {
    try {
      const res = await toggleListReviewMutation({
        variables: {
          input: {
            listId,
          },
        },
      })
      if (res.data?.signatureCollectionAdminToggleListReview.success) {
        toast.success(formatMessage(m.toggleReviewSuccess))
        setModalSubmitReviewIsOpen(false)
        revalidate()
      } else {
        toast.error(formatMessage(m.toggleReviewError))
      }
    } catch (e) {
      toast.error(e.message)
    }
  }

  return (
    <Box marginTop={20}>
      <Box display="flex" justifyContent="flexEnd">
        <Button
          iconType="outline"
          variant="ghost"
          icon={listReviewed ? 'lockOpened' : 'lockClosed'}
          colorScheme={listReviewed ? 'default' : 'destructive'}
          onClick={() => setModalSubmitReviewIsOpen(true)}
        >
          {modalText}
        </Button>
      </Box>
      <Modal
        id="toggleReviewComplete"
        isVisible={modalSubmitReviewIsOpen}
        title={modalText}
        onClose={() => setModalSubmitReviewIsOpen(false)}
        label={''}
        closeButtonLabel={''}
      >
        <Box marginTop={5}>
          <Text>
            {listReviewed
              ? formatMessage(m.listReviewedModalDescriptionToggleBack)
              : formatMessage(m.listReviewedModalDescription)}
          </Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              variant="ghost"
              onClick={() => toggleReview()}
              loading={loading}
              icon={listReviewed ? 'lockOpened' : 'lockClosed'}
              colorScheme={listReviewed ? 'default' : 'destructive'}
            >
              {modalText}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default ActionReviewComplete
