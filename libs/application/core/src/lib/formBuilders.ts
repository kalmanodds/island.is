import { MessageDescriptor } from 'react-intl'

import { Field } from '../types/Fields'
import { Condition } from '../types/Condition'
import {
  Form,
  FormChildren,
  FormItemTypes,
  FormLeaf,
  FieldRepeater,
  MultiField,
  ExternalDataProvider,
  Repeater,
  Section,
  SectionChildren,
  SubSection,
  DataProviderItem,
  FormModes,
  FormText,
} from '../types/Form'
import type { BoxProps } from '@island.is/island-ui/core'

export function buildForm(data: {
  id: string
  title: MessageDescriptor | string
  logo?: React.FC
  mode?: FormModes
  children: FormChildren[]
  renderLastScreenButton?: boolean
  icon?: string
}): Form {
  return { ...data, type: FormItemTypes.FORM }
}

export function buildMultiField(data: {
  id?: string
  condition?: Condition
  title: MessageDescriptor | string
  description?: FormText
  space?: BoxProps['paddingTop']
  children: Field[]
}): MultiField {
  return { ...data, type: FormItemTypes.MULTI_FIELD }
}

export function buildRepeater(data: {
  id: string
  condition?: Condition
  component: string
  title: MessageDescriptor | string
  children: FormLeaf[]
}): Repeater {
  return { ...data, type: FormItemTypes.REPEATER }
}

export function buildFieldRepeater(data: {
  id: string
  condition?: Condition
  title: MessageDescriptor | string
  min?: number
  max?: number
  item: Field | MultiField
}): FieldRepeater {
  const { min = 1 } = data
  // TODO: Multiple children if min has been set higher than 1
  return {
    ...data,
    type: FormItemTypes.FIELD_REPEATER,
    min,
    children: [data.item],
  }
}

export function buildSection(data: {
  id?: string
  condition?: Condition
  title: MessageDescriptor | string
  children: SectionChildren[]
}): Section {
  return { ...data, type: FormItemTypes.SECTION }
}

export function buildSubSection(data: {
  id?: string
  condition?: Condition
  title: MessageDescriptor | string
  children: FormLeaf[]
}): SubSection {
  return { ...data, type: FormItemTypes.SUB_SECTION }
}

export function buildExternalDataProvider(data: {
  title: MessageDescriptor | string
  subTitle?: MessageDescriptor | string
  checkboxLabel?: MessageDescriptor | string
  id: string
  condition?: Condition
  dataProviders: DataProviderItem[]
}): ExternalDataProvider {
  return {
    ...data,
    isPartOfRepeater: false,
    children: undefined,
    type: FormItemTypes.EXTERNAL_DATA_PROVIDER,
  }
}

export function buildDataProviderItem(data: {
  id: string
  type: string | undefined
  title: MessageDescriptor | string
  subTitle?: MessageDescriptor | string
  source?: string
}): DataProviderItem {
  return data
}
