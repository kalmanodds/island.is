import { useContext, useEffect, useMemo, useState } from 'react'
import { ControlContext } from '../../../../../../context/ControlContext'
import { FormSystemField, FormSystemListItem, Maybe } from '@island.is/api/schema'
import {
  GridRow as Row,
  GridColumn as Column,
  Text,
  Box,
  Button,
  Stack,
} from '@island.is/island-ui/core'
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  UniqueIdentifier
} from '@dnd-kit/core'
import { NavbarSelectStatus } from '../../../../../../lib/utils/interfaces'
import { ListItem } from './components/ListItem'
import { SortableContext } from '@dnd-kit/sortable'
import { createPortal } from 'react-dom'
import { useIntl } from 'react-intl'
import { m } from '../../../../../../lib/messages'
import { useLazyQuery } from '@apollo/client'
// eslint-disable-next-line @nx/enforce-module-boundaries
import { CREATE_LIST_ITEM, UPDATE_LIST_ITEM_DISPLAY_ORDER } from '@island.is/form-system/graphql'

export const ListBuilder = () => {
  const {
    control,
    controlDispatch,
    setSelectStatus,
    setInListBuilder,
  } = useContext(ControlContext)
  const currentItem = control.activeItem.data as FormSystemField
  const { activeListItem } = control
  const listItems =
    currentItem?.fieldSettings?.list ?? ([] as FormSystemListItem[])
  const listItemIds = useMemo(
    () =>
      listItems
        ?.filter(
          (l: Maybe<FormSystemListItem>): l is FormSystemListItem =>
            l !== null && l !== undefined,
        )
        .map((l: FormSystemListItem) => l?.id as UniqueIdentifier),
    [listItems],
  )
  const [connecting, setConnecting] = useState<boolean[]>(listItems.map(() => false))

  const { formatMessage } = useIntl()

  const [createListItem] = useLazyQuery(CREATE_LIST_ITEM)
  const [updateListItemDisplayOrder] = useLazyQuery(UPDATE_LIST_ITEM_DISPLAY_ORDER)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  )

  const addListItem = async () => {

    const newListItem = await createListItem({
      variables: {
        input: {
          createListItemDto: {
            fieldId: currentItem.id,
            displayOrder: listItems.length,
          }
        }
      }
    })
    controlDispatch({
      type: 'ADD_LIST_ITEM',
      payload: {
        newListItem: newListItem.data.createListItem
      }
    })
    setConnecting((prev) => [...prev, false])
  }

  const onDragStart = (event: DragStartEvent) => {
    controlDispatch({
      type: 'SET_ACTIVE_LIST_ITEM',
      payload: {
        listItem: event.active.data.current?.listItem,
      },
    })
  }

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event

    if (!over) return
    const activeId = active.id
    const overId = over.id
    controlDispatch({
      type: 'LIST_ITEM_OVER_LIST_ITEM',
      payload: {
        activeId: activeId,
        overId: overId,
      },
    })
  }


  const onDragEnd = () => {
    controlDispatch({
      type: 'SET_ACTIVE_LIST_ITEM',
      payload: {
        listItem: null,
      },
    })
    updateListItemDisplayOrder({
      variables: {
        input: {
          listItemsDisplayOrderDto: listItems.filter(l => l !== null).map(l => l.id)
        }
      }
    })
  }

  useEffect(() => {
    setSelectStatus(NavbarSelectStatus.ON_WITHOUT_SELECT)
  }, [])

  useEffect(() => {
    setConnecting(listItems.map(() => false))
  }, [listItems])

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="spaceBetween"
      style={{ minHeight: '500px' }}
    >
      <div>
        <Row>
          <Column>
            <Text variant="h3">Listasmiður</Text>
          </Column>
        </Row>
        <Stack space={2}>
          <DndContext
            id="listDnd"
            sensors={sensors}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
          >
            <SortableContext items={listItemIds}>
              {listItems &&
                listItems.map((l: Maybe<FormSystemListItem>, i: number) => {
                  if (l === null) {
                    return null
                  }
                  return (
                    <ListItem
                      key={l.id}
                      listItem={l}
                      index={i}
                      connecting={connecting ? connecting[i] : false}
                      setConnecting={setConnecting}
                    />
                  )
                })}
            </SortableContext>

            {typeof window === 'object' &&
              createPortal(
                <DragOverlay
                  dropAnimation={{
                    duration: 500,
                    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                  }}
                >
                  {activeListItem && (
                    <ListItem
                      listItem={activeListItem}
                      index={0}
                      connecting={false}
                      setConnecting={setConnecting}
                    />
                  )}
                </DragOverlay>,
                document.body,
              )}
          </DndContext>
        </Stack>
      </div>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="flexEnd"
        marginTop={2}
      >
        <Box marginRight={2}>
          <Button variant="ghost" onClick={addListItem}>
            {formatMessage(m.addListItem)}
          </Button>
        </Box>
        <div>
          <Button
            onClick={() => {
              setInListBuilder(false)
              setSelectStatus(NavbarSelectStatus.OFF)
            }}
          >
            {formatMessage(m.finish)}
          </Button>
        </div>
      </Box>
    </Box>
  )
}
