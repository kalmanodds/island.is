import {
  FormSystemForm,
  FormSystemScreen,
  FormSystemField,
  FormSystemListItem,
  FormSystemSection,
  FormSystemFieldSettings,
} from '@island.is/api/schema'
import { UniqueIdentifier } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { removeTypename } from '../lib/utils/removeTypename'
import { ActiveItem } from '../lib/utils/interfaces'
import { useFormMutations } from './formProviderHooks'

const { updateListItem, deleteListItem, updateField } = useFormMutations()

type ActiveItemActions =
  | { type: 'SET_ACTIVE_ITEM'; payload: { activeItem: ActiveItem } }
  | {
    type: 'SET_ACTIVE_LIST_ITEM'
    payload: { listItem: FormSystemListItem | null }
  }

type ScreenActions =
  | { type: 'ADD_SCREEN'; payload: { screen: FormSystemScreen } }
  | { type: 'REMOVE_SCREEN'; payload: { id: string } }

type FieldActions =
  | { type: 'ADD_FIELD'; payload: { field: FormSystemField } }
  | { type: 'REMOVE_FIELD'; payload: { id: string } }
  | {
    type: 'CHANGE_FIELD_TYPE'
    payload: {
      newValue: string
      fieldSettings: FormSystemFieldSettings
      update: (updatedActiveItem?: ActiveItem) => void
    }
  }
  | {
    type: 'CHANGE_DESCRIPTION'
    payload: { lang: 'en' | 'is'; newValue: string }
  }
  | {
    type: 'CHANGE_IS_REQUIRED'
    payload: { update: (updatedActiveItem?: ActiveItem) => void }
  }

type SectionActions =
  | { type: 'ADD_SECTION'; payload: { section: FormSystemSection } }
  | { type: 'REMOVE_SECTION'; payload: { id: string } }

type DndActions =
  | {
    type: 'SECTION_OVER_SECTION'
    payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
  }
  | {
    type: 'SCREEN_OVER_SECTION'
    payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
  }
  | {
    type: 'SCREEN_OVER_SCREEN'
    payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
  }
  | {
    type: 'FIELD_OVER_SCREEN'
    payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
  }
  | {
    type: 'FIELD_OVER_FIELD'
    payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
  }
  | {
    type: 'LIST_ITEM_OVER_LIST_ITEM'
    payload: { activeId: UniqueIdentifier; overId: UniqueIdentifier }
  }

type ChangeActions =
  | { type: 'CHANGE_NAME'; payload: { lang: 'en' | 'is'; newValue: string } }
  | {
    type: 'CHANGE_FORM_NAME'
    payload: { lang: 'en' | 'is'; newValue: string }
  }
  | { type: 'CHANGE_APPLICATION_DAYS_TO_REMOVE'; payload: { value: number } }
  | { type: 'CHANGE_INVALIDATION_DATE'; payload: { value: Date } }
  | {
    type: 'CHANGE_STOP_PROGRESS_ON_VALIDATING_SCREEN'
    payload: { value: boolean; update: (updatedForm: FormSystemForm) => void }
  }
  | { type: 'CHANGE_FORM_SETTINGS'; payload: { newForm: FormSystemForm } }
  | {
    type: 'TOGGLE_DEPENDENCY'
    payload: {
      activeId: string
      itemId: string
      update: (updatedForm: FormSystemForm) => void
    }
  }
  | {
    type: 'TOGGLE_MULTI_SET'
    payload: {
      checked: boolean
      update: (updatedActiveItem?: ActiveItem) => void
    }
  }

type InputSettingsActions =
  | {
    type: 'SET_MESSAGE_WITH_LINK_SETTINGS'
    payload: {
      property: 'buttonText' | 'url' | 'hasLink'
      value?: string
      checked?: boolean
      lang?: 'is' | 'en'
      update?: (updatedActiveItem?: ActiveItem) => void
    }
  }
  | {
    type: 'SET_FILE_UPLOAD_SETTINGS'
    payload: {
      property: 'isMulti' | 'maxSize' | 'amount' | 'types'
      checked?: boolean
      value?: string | number
      update: (updatedActiveItem?: ActiveItem) => void
    }
  }
  | {
    type: 'SET_FIELD_SETTINGS'
    payload: {
      property: 'isLarge'
      value: boolean
      update: (updatedActiveItem?: ActiveItem) => void
    }
  }
  | {
    type: 'SET_LIST_ITEM_SELECTED'
    payload: {
      id: UniqueIdentifier
    }
  }
  | {
    type: 'REMOVE_LIST_ITEM'
    payload: {
      id: UniqueIdentifier
      update: (updatedActiveItem?: ActiveItem) => void
    }
  }
  | {
    type: 'CHANGE_LIST_ITEM'
    payload: {
      property: 'label' | 'description'
      lang: 'is' | 'en'
      value: string
      id: UniqueIdentifier
    }
  }
  | { type: 'ADD_LIST_ITEM', payload: { newListItem: FormSystemListItem } }
  | {
    type: 'SET_LIST_TYPE'
    payload: {
      listType: string
      update: (updatedActiveItem?: ActiveItem) => void
    }
  }

export type ControlAction =
  | ActiveItemActions
  | ScreenActions
  | FieldActions
  | SectionActions
  | DndActions
  | ChangeActions
  | InputSettingsActions

export interface ControlState {
  activeItem: ActiveItem
  activeListItem: FormSystemListItem | null
  form: FormSystemForm
}

export const controlReducer = (
  state: ControlState,
  action: ControlAction,
): ControlState => {
  const { form, activeItem } = state
  // const { stepsList: steps, groupsList: groups, inputsList: inputs } = form
  const { sections, screens, fields } = form
  switch (action.type) {
    case 'SET_ACTIVE_ITEM':
      return {
        ...state,
        activeItem: action.payload.activeItem,
      }
    case 'SET_ACTIVE_LIST_ITEM': {
      return {
        ...state,
        activeListItem: action.payload.listItem,
      }
    }
    // Sections
    case 'ADD_SECTION':
      return {
        ...state,
        activeItem: {
          type: 'Section',
          data: action.payload.section,
        },
        form: {
          ...form,
          sections: [...(sections || []), action.payload.section],
        },
      }
    case 'REMOVE_SECTION': {
      const newSections = state.form.sections?.filter(
        (section) => section?.id !== action.payload.id,
      )
      return {
        ...state,
        form: {
          ...form,
          sections: newSections,
        },
      }
    }

    // Screens
    case 'ADD_SCREEN':
      return {
        ...state,
        activeItem: {
          type: 'Screen',
          data: action.payload.screen,
        },
        form: {
          ...form,
          screens: [...(screens || []), action.payload.screen],
        },
      }
    case 'REMOVE_SCREEN': {
      const newScreens = state.form.screens?.filter(
        (screen) => screen?.id !== action.payload.id,
      )
      const currentItem = state.activeItem.data as FormSystemScreen
      const newActiveItem = state.form.sections?.find(
        (section) => section?.id === currentItem.sectionId,
      )
      return {
        ...state,
        activeItem: {
          type: 'Section',
          data: newActiveItem,
        },
        form: {
          ...form,
          screens: newScreens,
        },
      }
    }

    // Fields
    case 'ADD_FIELD': {
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: action.payload.field,
        },
        form: {
          ...form,
          fields: [...(fields || []), action.payload.field],
        },
      }
    }
    case 'REMOVE_FIELD': {
      const newFields = state.form.fields?.filter(
        (field) => field?.id !== action.payload.id,
      )
      const currentItem = state.activeItem.data as FormSystemField
      const newActiveItem = state.form.screens?.find(
        (screen) => screen?.id === currentItem.screenId,
      )
      return {
        ...state,
        activeItem: {
          type: 'Screen',
          data: newActiveItem,
        },
        form: {
          ...form,
          fields: newFields,
        },
      }
    }
    case 'CHANGE_FIELD_TYPE': {
      const { newValue, fieldSettings, update } = action.payload
      const newActive = {
        ...activeItem,
        data: {
          ...activeItem.data,
          type: newValue,
          fieldSettings: removeTypename(fieldSettings),
        },
      }
      update(newActive)
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          fields: fields?.map((f) =>
            f?.id === activeItem.data?.id ? newActive.data : f,
          ),
        },
      }
    }
    case 'CHANGE_DESCRIPTION': {
      const { lang, newValue } = action.payload
      const currentData = activeItem.data as FormSystemField
      const newActive = {
        ...activeItem,
        data: {
          ...currentData,
          description: {
            ...currentData?.description,
            [lang]: newValue,
          },
        },
      }
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          fields: fields?.map((i) =>
            i?.id === currentData?.id ? newActive.data : i,
          ),
        },
      }
    }
    /* Uncomment and finish when field has isRequired property */

    // case 'CHANGE_IS_REQUIRED': {
    //   const currentData = activeItem.data as FormSystemField
    //   const newActive = {
    //     ...activeItem,
    //     data: {
    //       ...currentData,
    //       isRequired: !currentData?.isRequired,
    //     },
    //   }
    //   action.payload.update(newActive)
    //   return {
    //     ...state,
    //     activeItem: newActive,
    //     form: {
    //       ...form,
    //       inputsList: inputs?.map((i) =>
    //         i?.guid === currentData?.guid ? newActive.data : i,
    //       ),
    //     },
    //   }
    // }

    // Change
    case 'CHANGE_NAME': {
      const { lang, newValue } = action.payload
      const newActive = {
        ...activeItem,
        data: {
          ...activeItem.data,
          name: {
            ...activeItem.data?.name,
            [lang]: newValue,
          },
        },
      }
      const { type } = activeItem
      let updatedList
      if (type === 'Section') {
        updatedList = sections?.map((s) =>
          s?.id === activeItem.data?.id ? newActive.data : s,
        )
      } else if (type === 'Screen') {
        updatedList = screens?.map((g) =>
          g?.id === activeItem.data?.id ? newActive.data : g,
        )
      } else if (type === 'Field') {
        updatedList = fields?.map((i) =>
          i?.id === activeItem.data?.id ? newActive.data : i,
        )
      }
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          sections:
            type === 'Section'
              ? (updatedList as FormSystemSection[])
              : form.sections,
          screens:
            type === 'Screen'
              ? (updatedList as FormSystemScreen[])
              : form.screens,
          fields:
            type === 'Field'
              ? (updatedList as FormSystemField[])
              : form.fields,
        },
      }
    }
    case 'CHANGE_FORM_NAME': {
      const { lang, newValue } = action.payload
      return {
        ...state,
        form: {
          ...form,
          name: {
            ...form.name,
            [lang]: newValue,
          },
        },
      }
    }
    case 'CHANGE_APPLICATION_DAYS_TO_REMOVE': {
      return {
        ...state,
        form: {
          ...form,
          applicationDaysToRemove: action.payload.value,
        },
      }
    }
    case 'CHANGE_INVALIDATION_DATE': {
      return {
        ...state,
        form: {
          ...form,
          invalidationDate: action.payload.value,
        },
      }
    }
    case 'CHANGE_FORM_SETTINGS': {
      return {
        ...state,
        form: action.payload.newForm,
      }
    }
    case 'CHANGE_STOP_PROGRESS_ON_VALIDATING_SCREEN': {
      const updatedState = {
        ...state,
        form: {
          ...form,
          stopProgressOnValidatingStep: action.payload.value,
        },
      }
      action.payload.update({ ...updatedState.form }) // TODO: missing endpoint
      return updatedState
    }

    // Check whether dependencies has a dependency object with activeId in parentProp
    // If it does, check if the childProps array contains the itemId
    // If it does, remove it, if it doesn't, add it
    // If parent exists and child doesn't, add it
    // If parent exists and child exists, remove it from the array and also remove the dependency object if the array is empty
    case 'TOGGLE_DEPENDENCY': {
      const { activeId, itemId, update } = action.payload
      const dependency = form.dependencies?.find(
        (dep) => dep?.parentProp === activeId,
      )
      const parentExists = dependency !== undefined
      const childExists = dependency?.childProps?.includes(itemId) ?? false
      let updatedDependencies = form.dependencies ?? []
      if (parentExists) {
        if (childExists) {
          const updatedChildProps = dependency?.childProps?.filter(
            (child) => child !== itemId,
          )
          if (updatedChildProps?.length) {
            updatedDependencies = updatedDependencies.map((dep) =>
              dep?.parentProp === activeId
                ? { ...dep, childProps: updatedChildProps }
                : dep,
            )
          } else {
            updatedDependencies = updatedDependencies.filter(
              (dep) => dep?.parentProp !== activeId,
            )
          }
        } else {
          updatedDependencies = updatedDependencies.map((dep) =>
            dep?.parentProp === activeId
              ? { ...dep, childProps: [...(dep.childProps ?? []), itemId] }
              : dep,
          )
        }
      } else {
        updatedDependencies = [
          ...updatedDependencies,
          { parentProp: activeId, childProps: [itemId] },
        ]
      }
      const updatedForm = {
        ...form,
        dependencies: updatedDependencies,
      }
      update(updatedForm)
      return {
        ...state,
        form: updatedForm,
      }
    }

    case 'TOGGLE_MULTI_SET': {
      const currentData = activeItem.data as FormSystemScreen
      const newActive = {
        ...activeItem,
        data: {
          ...currentData,
          multiSet: action.payload.checked ? 1 : 0,
        },
      }
      action.payload.update(newActive)
      return {
        ...state,
        activeItem: newActive,
        form: {
          ...form,
          screens: screens?.map((g) =>
            g?.id === currentData?.id ? newActive.data : g,
          ),
        },
      }
    }
    // Input settings
    case 'SET_MESSAGE_WITH_LINK_SETTINGS': {
      const field = activeItem.data as FormSystemField
      const { property, lang: langg, value, checked, update } = action.payload
      const lang = langg ?? 'is'

      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          [property]: property === 'hasLink' ? checked : value,
          ...(property === 'buttonText'
            ? {
              buttonText: {
                ...field.fieldSettings?.buttonText,
                [lang]: value,
              },
            }
            : {}),
        },
      }
      if (property === 'hasLink' && update) {
        update({ type: 'Field', data: newField })
      }
      return {
        ...state,
        activeItem: {
          type: 'Section',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) =>
            i?.id === field.id ? newField : i,
          ),
        },
      }
    }
    case 'SET_FILE_UPLOAD_SETTINGS': {
      const field = activeItem.data as FormSystemField
      const { property, checked, value, update } = action.payload

      const updateFileTypesArray = (): string => {
        const newFileTypes = field.fieldSettings?.fileTypes?.split(',') ?? []
        if (checked) {
          return [...newFileTypes, value as string].toString()
        } else {
          return newFileTypes.filter((type) => type !== value).toString()
        }
      }
      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          [property]:
            property === 'types'
              ? updateFileTypesArray()
              : property === 'isMulti'
                ? checked
                : value,
        },
      }
      update({ type: 'Field', data: newField })
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) =>
            i?.id === field.id ? newField : i,
          ),
        },
      }
    }
    case 'SET_FIELD_SETTINGS': {
      const field = activeItem.data as FormSystemField
      const { property, value, update } = action.payload
      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          [property]: value,
        },
      }
      update({ type: 'Field', data: newField })
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) =>
            i?.id === field.id ? newField : i,
          ),
        },
      }
    }
    case 'SET_LIST_ITEM_SELECTED': {
      const { id } = action.payload
      const field = activeItem.data as FormSystemField
      const list = field.fieldSettings?.list ?? []
      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          list: list.filter(l => l !== null && l !== undefined).map((l: FormSystemListItem) =>
            l.id === id
              ? { ...l, isSelected: !l.isSelected }
              : { ...l, isSelected: false },
          ),
        },
      }
      updateField[0]({
        variables: {
          input: {
            id: id,
            updateFieldDto: {
              updateFieldDto: newField
            }
          }
        }
      })
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) =>
            i?.id === field.id ? newField : i,
          ),
        },
      }
    }
    case 'REMOVE_LIST_ITEM': {
      const { id, update } = action.payload
      const field = activeItem.data as FormSystemField
      const list = field.fieldSettings?.list ?? []
      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          list: list.filter((l: FormSystemListItem | null | undefined): l is FormSystemListItem => l !== null && l !== undefined && l.id !== id),
        },
      }
      update({ type: 'Field', data: newField })

      deleteListItem[0]({
        variables: {
          input: {
            id: id
          }
        }
      })
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) =>
            i?.id === field.id ? newField : i,
          ),
        },
      }
    }

    case 'ADD_LIST_ITEM': {
      const field = activeItem.data as FormSystemField
      const list = field.fieldSettings?.list ?? []
      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          list: [...list, action.payload.newListItem],
        },
      }
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) =>
            i?.id === field.id ? newField : i,
          ),
        },
      }
    }
    case 'CHANGE_LIST_ITEM': {
      const field = activeItem.data as FormSystemField
      const list = field.fieldSettings?.list as FormSystemListItem[]
      const { property, lang, value, id } = action.payload
      const listItem = list?.find((l) => l?.id === id) as FormSystemListItem

      const newListItem = {
        ...listItem,
        [property]: {
          ...listItem[property],
          [lang]: value,
        },
      }

      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          list: list.filter(l => l !== null).map((l: FormSystemListItem) => {
            if (l.id === id) {
              return newListItem
            }
            return l
          }),
        },
      }

      updateListItem[0]({
        variables: {
          input: {
            id: id,
            updateListItemDto: newListItem
          }
        }
      })

      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((i) =>
            i?.id === field.id ? newField : i,
          ),
        },
      }
    }
    case 'SET_LIST_TYPE': {
      const field = activeItem.data as FormSystemField
      const { listType, update } = action.payload
      const newField = {
        ...field,
        fieldSettings: {
          ...field.fieldSettings,
          listType: listType,
        },
      }
      update({ type: 'Field', data: newField })
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((f) =>
            f?.id === field.id ? newField : f,
          ),
        },
      }
    }
    // Drag and Drop
    case 'SECTION_OVER_SECTION': {
      const activeIndex = sections?.findIndex(
        (section) => section?.id === action.payload.activeId,
      ) as number
      const overIndex = sections?.findIndex(
        (section) => section?.id === action.payload.overId,
      ) as number
      const updatedSections = arrayMove(sections || [], activeIndex, overIndex)
      return {
        ...state,
        form: {
          ...form,
          sections: updatedSections,
        },
      }
    }
    case 'SCREEN_OVER_SECTION': {
      const activeIndex = screens?.findIndex(
        (screen) => screen?.id === action.payload.activeId,
      ) as number
      const overIndex = sections?.findIndex(
        (section) => section?.id === action.payload.overId,
      ) as number
      const updatedScreens = sections as FormSystemScreen[]
      if (sections && sections[overIndex]) {
        updatedScreens[activeIndex].sectionId = action.payload.overId as string
      }
      return {
        ...state,
        form: {
          ...form,
          screens: arrayMove(updatedScreens, activeIndex, activeIndex)
        },
      }
    }
    case 'SCREEN_OVER_SCREEN': {
      const activeIndex = screens?.findIndex(
        (screen) => screen?.id === action.payload.activeId,
      ) as number
      const overIndex = screens?.findIndex(
        (screen) => screen?.id === action.payload.overId,
      ) as number
      const updatedScreens = screens as FormSystemScreen[]
      if (updatedScreens[activeIndex] && updatedScreens[overIndex]) {
        if (
          updatedScreens[activeIndex].sectionId !==
          updatedScreens[overIndex].sectionId
        ) {
          updatedScreens[activeIndex].sectionId =
            updatedScreens[overIndex].sectionId
          return {
            ...state,
            form: {
              ...form,
              screens: arrayMove(
                updatedScreens,
                activeIndex,
                overIndex - 1,
              ),
            },
          }
        }
        return {
          ...state,
          form: {
            ...form,
            screens: arrayMove(updatedScreens, activeIndex, overIndex)
          },
        }
      }
      return state
    }
    case 'FIELD_OVER_SCREEN': {
      const activeIndex = fields?.findIndex(
        (field) => field?.id === action.payload.activeId,
      ) as number
      const overIndex = screens?.findIndex(
        (screen) => screen?.id === action.payload.overId,
      ) as number
      const updatedInputs = fields?.map((input) => ({
        ...input,
      })) as FormSystemField[]
      if (screens && screens[overIndex]) {
        updatedInputs[activeIndex].id = action.payload.overId as string
      }
      return {
        ...state,
        form: {
          ...form,
          fields: arrayMove(updatedInputs, activeIndex, overIndex)
        },
      }
    }
    case 'FIELD_OVER_FIELD': {
      const activeIndex = fields?.findIndex(
        (field) => field?.id === action.payload.activeId,
      ) as number
      const overIndex = fields?.findIndex(
        (field) => field?.id === action.payload.overId,
      ) as number
      const updatedInputs = fields as FormSystemField[]
      if (updatedInputs[activeIndex] && updatedInputs[overIndex]) {
        if (
          updatedInputs[activeIndex].id !==
          updatedInputs[overIndex].id
        ) {
          updatedInputs[activeIndex].id =
            updatedInputs[overIndex].id
          return {
            ...state,
            form: {
              ...form,
              fields: arrayMove(
                updatedInputs,
                activeIndex,
                overIndex - 1,
              )
            },
          }
        }
        return {
          ...state,
          form: {
            ...form,
            fields: arrayMove(updatedInputs, activeIndex, overIndex)
          },
        }
      }
      return state
    }
    case 'LIST_ITEM_OVER_LIST_ITEM': {
      const fieldItem = activeItem.data as FormSystemField
      const list = fieldItem.fieldSettings?.list as FormSystemListItem[]
      const { activeId, overId } = action.payload
      if (!list) {
        return state
      }
      const activeIndex = list.findIndex(
        (listItem) => listItem?.id === activeId,
      )
      const overIndex = list.findIndex(
        (listItem) => listItem?.id === overId,
      )

      const newField: FormSystemField = {
        ...fieldItem,
        fieldSettings: {
          ...fieldItem.fieldSettings,
          list: arrayMove<FormSystemListItem>(list, activeIndex, overIndex).map(
            (l: FormSystemListItem, i: number) => ({ ...l, displayOrder: i }),
          ),
        },
      }
      return {
        ...state,
        activeItem: {
          type: 'Field',
          data: newField,
        },
        form: {
          ...form,
          fields: fields?.map((field) =>
            field?.id === fieldItem.id ? newField : field,
          ),
        },
      }
    }
    default:
      return state
  }
}
