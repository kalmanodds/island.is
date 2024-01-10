import CreateListTemplate from './lib/CreateListTemplate'
import { z } from 'zod'
import { dataSchema } from './lib/dataSchema'

export const getFields = () => import('./fields')
export * from './lib/errors'

export default CreateListTemplate
export type CreateListSchema = z.TypeOf<typeof dataSchema>
