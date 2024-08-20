export enum NotificationType {
  HEADS_UP = 'HEADS_UP',
  READY_FOR_COURT = 'READY_FOR_COURT',
  RECEIVED_BY_COURT = 'RECEIVED_BY_COURT',
  COURT_DATE = 'COURT_DATE', // TODO: Rename to ARRAIGNMENT_DATE at some point?
  RULING = 'RULING',
  MODIFIED = 'MODIFIED',
  REVOKED = 'REVOKED',
  DEFENDER_ASSIGNED = 'DEFENDER_ASSIGNED',
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
  INDICTMENTS_WAITING_FOR_CONFIRMATION = 'INDICTMENTS_WAITING_FOR_CONFIRMATION',
}
