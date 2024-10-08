import { useLocale } from '@island.is/localization'
import { Box, Button, Text, toast } from '@island.is/island-ui/core'
import { useState } from 'react'
import { Modal } from '@island.is/react/components'
import { useRevalidator } from 'react-router-dom'
import { m } from '../../../lib/messages'
import { ListStatus } from '../../../lib/utils'
import { useSignatureCollectionLockListMutation } from './lockList.generated'

const ActionLockList = ({
  listId,
  listStatus,
}: {
  listId: string
  listStatus: string
}) => {
  const { formatMessage } = useLocale()
  const { revalidate } = useRevalidator()

  const [modalLockListIsOpen, setModalLockListIsOpen] = useState(false)

  const [lockList, { loading: loadingLockList }] =
    useSignatureCollectionLockListMutation({
      variables: {
        input: {
          listId,
        },
      },
      onCompleted: () => {
        setModalLockListIsOpen(false)
        revalidate()
        toast.success(formatMessage(m.lockListSuccess))
      },
      onError: () => {
        toast.error(formatMessage(m.lockListError))
      },
    })

  return (
    <Box>
      <Button
        iconType="outline"
        variant="ghost"
        icon="lockClosed"
        colorScheme="destructive"
        onClick={() => setModalLockListIsOpen(true)}
      >
        {formatMessage(m.lockList)}
      </Button>
      <Modal
        id="toggleLockList"
        isVisible={modalLockListIsOpen}
        title={formatMessage(m.lockList)}
        onClose={() => setModalLockListIsOpen(false)}
        label={''}
        closeButtonLabel={''}
      >
        <Box marginTop={5}>
          <Text>{formatMessage(m.lockList)}</Text>
          <Box display="flex" justifyContent="flexEnd" marginTop={5}>
            <Button
              iconType="outline"
              variant="ghost"
              onClick={() => lockList()}
              loading={loadingLockList}
              icon="lockClosed"
              colorScheme="destructive"
            >
              {formatMessage(m.lockList)}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  )
}

export default ActionLockList
