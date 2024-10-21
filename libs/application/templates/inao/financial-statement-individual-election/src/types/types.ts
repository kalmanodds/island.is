import { DefaultEvents } from '@island.is/application/types'

export type Events = { type: DefaultEvents.SUBMIT }

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  DONE = 'done',
}

export enum Roles {
  APPLICANT = 'applicant',
}

export enum ApiActions {
  getUserType = 'getUserType',
  submitApplication = 'submitApplication',
}

export type Options = {
  label: string
  value: string
}[]
