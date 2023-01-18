import { RolesRule, RulesType } from '@island.is/judicial-system/auth'
import { NotificationType, UserRole } from '@island.is/judicial-system/types'

// Allows prosecutors to send notifications
export const prosecutorNotificationRule = {
  role: UserRole.Prosecutor,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    NotificationType.HEADS_UP,
    NotificationType.READY_FOR_COURT,
    NotificationType.MODIFIED,
    NotificationType.REVOKED,
  ],
} as RolesRule

// Allows representatives to send notifications
export const representativeNotificationRule = {
  role: UserRole.Representative,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [NotificationType.REVOKED],
} as RolesRule

// Allows judges to send notifiications
export const judgeNotificationRule = {
  role: UserRole.Judge,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    NotificationType.RECEIVED_BY_COURT,
    NotificationType.COURT_DATE,
    NotificationType.MODIFIED,
    NotificationType.DEFENDER_ASSIGNED,
  ],
} as RolesRule

// Allows registrars to send notifications
export const registrarNotificationRule = {
  role: UserRole.Registrar,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    NotificationType.RECEIVED_BY_COURT,
    NotificationType.COURT_DATE,
    NotificationType.MODIFIED,
    NotificationType.DEFENDER_ASSIGNED,
  ],
} as RolesRule

// Allows assistants to send notifications
export const assistantNotificationRule = {
  role: UserRole.Assistant,
  type: RulesType.FIELD_VALUES,
  dtoField: 'type',
  dtoFieldValues: [
    NotificationType.RECEIVED_BY_COURT,
    NotificationType.COURT_DATE,
    NotificationType.DEFENDER_ASSIGNED,
  ],
} as RolesRule
