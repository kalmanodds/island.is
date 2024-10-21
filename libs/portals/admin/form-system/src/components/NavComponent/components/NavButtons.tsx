import { Box, DialogPrompt, Icon, Tooltip } from '@island.is/island-ui/core'
import { useContext } from 'react'
import { FormSystemScreen, FormSystemField } from '@island.is/api/schema'
import { ControlContext } from '../../../context/ControlContext'
import { removeTypename } from '../../../lib/utils/removeTypename'
import { useIntl } from 'react-intl'
import { m } from '../../../lib/messages'
import { useMutation } from '@apollo/client'
import { CREATE_FIELD, CREATE_SCREEN, DELETE_FIELD, DELETE_SCREEN } from '@island.is/form-system/graphql'


export const NavButtons = () => {
  const { control, controlDispatch } = useContext(ControlContext)
  const { activeItem, form } = control
  const { screens, fields } = form
  const { formatMessage } = useIntl()
  const hoverText =
    activeItem.type === 'Section'
      ? formatMessage(m.addGroupHover)
      : formatMessage(m.addInputHover)

  const containsGroupOrInput = (): boolean | undefined => {
    const { type } = activeItem
    if (type === 'Section') {
      return screens?.some((screen) => screen?.sectionId === activeItem?.data?.id)
    }
    if (type === 'Screen') {
      return fields?.some(
        (field) => field?.screenId === activeItem?.data?.id,
      )
    }
    return false
  }

  const createScreen = useMutation(CREATE_SCREEN)
  const createField = useMutation(CREATE_FIELD)
  const deleteScreen = useMutation(DELETE_SCREEN)
  const deleteField = useMutation(DELETE_FIELD)

  const addItem = async () => {
    if (activeItem.type === 'Section') {
      const newScreen = await createScreen[0]({
        variables: {
          input: {
            createScreenDto: {
              sectionId: activeItem?.data?.id,
            }
          },
        },
      })
      if (newScreen && !createScreen[1].loading) {
        console.log('newScreen', newScreen)
        controlDispatch({
          type: 'ADD_SCREEN',
          payload: {
            screen: removeTypename(
              newScreen.data?.formSystemCreateScreen,
            ) as FormSystemScreen,
          },
        })
      }
    } else if (activeItem.type === 'Screen') {
      const newField = await createField[0]({
        variables: {
          input: {
            createFieldDto: {
              screenId: activeItem?.data?.id,
            }
          },
        },
      })
      if (newField) {
        controlDispatch({
          type: 'ADD_FIELD',
          payload: {
            field: removeTypename(
              newField.data?.formSystemCreateField,
            ) as FormSystemField,
          },
        })
      }
    }
  }

  const remove = async () => {
    const id = activeItem?.data?.id as string
    if (activeItem.type === 'Section') {
      await deleteScreen[0]({
        variables: {
          input: {
            id: id,
          },
        },
      })
      controlDispatch({ type: 'REMOVE_SECTION', payload: { id: id } })
    } else if (activeItem.type === 'Screen') {
      await deleteScreen[0]({
        variables: {
          input: {
            id: id,
          },
        },
      })
      controlDispatch({ type: 'REMOVE_SCREEN', payload: { id: id } })
    } else if (activeItem.type === 'Field') {
      await deleteField[0]({
        variables: {
          input: {
            id: id,
          },
        },
      })
      controlDispatch({ type: 'REMOVE_FIELD', payload: { id: id } })
    }
  }

  return (
    <Box display="flex" flexDirection="row">
      {activeItem.type !== 'Field' && (
        <Box
          style={{ paddingTop: '5px', cursor: 'pointer' }}
          marginRight={1}
          onClick={addItem}
        >
          <Tooltip text={hoverText} color="yellow200">
            <span>
              <Icon icon="add" color="blue400" size="medium" />
            </span>
          </Tooltip>
        </Box>
      )}
      {containsGroupOrInput() ? (
        <DialogPrompt
          baseId="remove"
          title={formatMessage(m.areYouSure)}
          description={formatMessage(m.completelySure)}
          ariaLabel="Remove item"
          buttonTextConfirm={formatMessage(m.confirm)}
          buttonTextCancel={formatMessage(m.cancel)}
          onConfirm={remove}
          disclosureElement={
            <Box style={{ paddingTop: '5px', cursor: 'pointer' }}>
              <Tooltip text={formatMessage(m.delete)}>
                <span>
                  <Icon icon="trash" size="medium" />
                </span>
              </Tooltip>
            </Box>
          }
        />
      ) : (
        <Box style={{ paddingTop: '5px', cursor: 'pointer' }} onClick={remove}>
          <Tooltip text={formatMessage(m.delete)}>
            <span>
              <Icon icon="trash" size="medium" />
            </span>
          </Tooltip>
        </Box>
      )}
    </Box>
  )
}
