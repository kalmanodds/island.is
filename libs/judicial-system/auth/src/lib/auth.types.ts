import type { UserRole, User } from '@island.is/judicial-system/types'

export type Credentials = {
  user: User
  csrfToken: string
}

export enum RulesType {
  BASIC,
  FIELD,
  FIELD_VALUES,
}

type RolesBasicRule = {
  role: UserRole
  type: RulesType.BASIC
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canActivate?: (request: any) => boolean
}

type RolesFieldRule = {
  role: UserRole
  type: RulesType.FIELD
  dtoFields: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canActivate?: (request: any) => boolean
}

type RolesFieldValuesRule = {
  role: UserRole
  type: RulesType.FIELD_VALUES
  dtoField: string
  dtoFieldValues: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  canActivate?: (request: any) => boolean
}

export type RolesRule =
  | UserRole
  | RolesBasicRule
  | RolesFieldRule
  | RolesFieldValuesRule
