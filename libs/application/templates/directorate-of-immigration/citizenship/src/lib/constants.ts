import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT | DefaultEvents.ABORT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  PAYMENT = 'payment',
  IN_REVIEW = 'inReview',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
}
