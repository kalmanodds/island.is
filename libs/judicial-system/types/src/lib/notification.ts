export enum CaseNotificationType {
  HEADS_UP = 'HEADS_UP',
  READY_FOR_COURT = 'READY_FOR_COURT',
  RECEIVED_BY_COURT = 'RECEIVED_BY_COURT',
  COURT_DATE = 'COURT_DATE',
  RULING = 'RULING',
  MODIFIED = 'MODIFIED',
  REVOKED = 'REVOKED',
  DEFENDER_ASSIGNED = 'DEFENDER_ASSIGNED', // Depricated and will be removed after db migration
  ADVOCATE_ASSIGNED = 'ADVOCATE_ASSIGNED',
  DEFENDANTS_NOT_UPDATED_AT_COURT = 'DEFENDANTS_NOT_UPDATED_AT_COURT',
  APPEAL_TO_COURT_OF_APPEALS = 'APPEAL_TO_COURT_OF_APPEALS',
  APPEAL_RECEIVED_BY_COURT = 'APPEAL_RECEIVED_BY_COURT',
  APPEAL_STATEMENT = 'APPEAL_STATEMENT',
  APPEAL_COMPLETED = 'APPEAL_COMPLETED',
  APPEAL_JUDGES_ASSIGNED = 'APPEAL_JUDGES_ASSIGNED',
  APPEAL_CASE_FILES_UPDATED = 'APPEAL_CASE_FILES_UPDATED',
  APPEAL_WITHDRAWN = 'APPEAL_WITHDRAWN',
  INDICTMENT_DENIED = 'INDICTMENT_DENIED',
  INDICTMENT_RETURNED = 'INDICTMENT_RETURNED',
  CASE_FILES_UPDATED = 'CASE_FILES_UPDATED',
}

export enum SubpoenaNotificationType {
  SERVICE_SUCCESSFUL = 'SERVICE_SUCCESSFUL',
  SERVICE_FAILED = 'SERVICE_FAILED',
  DEFENDANT_SELECTED_DEFENDER = 'DEFENDANT_SELECTED_DEFENDER',
}

export enum NotificationType {
  HEADS_UP = CaseNotificationType.HEADS_UP,
  READY_FOR_COURT = CaseNotificationType.READY_FOR_COURT,
  RECEIVED_BY_COURT = CaseNotificationType.RECEIVED_BY_COURT,
  COURT_DATE = CaseNotificationType.COURT_DATE,
  RULING = CaseNotificationType.RULING,
  MODIFIED = CaseNotificationType.MODIFIED,
  REVOKED = CaseNotificationType.REVOKED,
  DEFENDER_ASSIGNED = CaseNotificationType.DEFENDER_ASSIGNED,
  ADVOCATE_ASSIGNED = CaseNotificationType.ADVOCATE_ASSIGNED,
  DEFENDANTS_NOT_UPDATED_AT_COURT = CaseNotificationType.DEFENDANTS_NOT_UPDATED_AT_COURT,
  APPEAL_TO_COURT_OF_APPEALS = CaseNotificationType.APPEAL_TO_COURT_OF_APPEALS,
  APPEAL_RECEIVED_BY_COURT = CaseNotificationType.APPEAL_RECEIVED_BY_COURT,
  APPEAL_STATEMENT = CaseNotificationType.APPEAL_STATEMENT,
  APPEAL_COMPLETED = CaseNotificationType.APPEAL_COMPLETED,
  APPEAL_JUDGES_ASSIGNED = CaseNotificationType.APPEAL_JUDGES_ASSIGNED,
  APPEAL_CASE_FILES_UPDATED = CaseNotificationType.APPEAL_CASE_FILES_UPDATED,
  APPEAL_WITHDRAWN = CaseNotificationType.APPEAL_WITHDRAWN,
  INDICTMENT_DENIED = CaseNotificationType.INDICTMENT_DENIED,
  INDICTMENT_RETURNED = CaseNotificationType.INDICTMENT_RETURNED,
  CASE_FILES_UPDATED = CaseNotificationType.CASE_FILES_UPDATED,
  SERVICE_SUCCESSFUL = SubpoenaNotificationType.SERVICE_SUCCESSFUL,
  SERVICE_FAILED = SubpoenaNotificationType.SERVICE_FAILED,
  DEFENDANT_SELECTED_DEFENDER = SubpoenaNotificationType.DEFENDANT_SELECTED_DEFENDER,
}

export enum InstitutionNotificationType {
  INDICTMENTS_WAITING_FOR_CONFIRMATION = 'INDICTMENTS_WAITING_FOR_CONFIRMATION',
}

export enum NotificationDispatchType {
  INDICTMENTS_WAITING_FOR_CONFIRMATION = InstitutionNotificationType.INDICTMENTS_WAITING_FOR_CONFIRMATION,
}
