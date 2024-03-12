import type { User } from '@island.is/judicial-system/types'

export enum MessageType {
  DELIVER_PROSECUTOR_TO_COURT = 'DELIVER_PROSECUTOR_TO_COURT',
  DELIVER_DEFENDANT_TO_COURT = 'DELIVER_DEFENDANT_TO_COURT',
  DELIVER_CASE_FILE_TO_COURT = 'DELIVER_CASE_FILE_TO_COURT',
  DELIVER_CASE_FILES_RECORD_TO_COURT = 'DELIVER_CASE_FILES_RECORD_TO_COURT',
  DELIVER_REQUEST_TO_COURT = 'DELIVER_REQUEST_TO_COURT',
  DELIVER_COURT_RECORD_TO_COURT = 'DELIVER_COURT_RECORD_TO_COURT',
  DELIVER_SIGNED_RULING_TO_COURT = 'DELIVER_SIGNED_RULING_TO_COURT',
  DELIVER_CASE_CONCLUSION_TO_COURT = 'DELIVER_CASE_CONCLUSION_TO_COURT',
  DELIVER_CASE_TO_POLICE = 'DELIVER_CASE_TO_POLICE',
  DELIVER_INDICTMENT_CASE_TO_POLICE = 'DELIVER_INDICTMENT_CASE_TO_POLICE',
  DELIVER_INDICTMENT_TO_POLICE = 'DELIVER_INDICTMENT_TO_POLICE',
  DELIVER_CASE_FILES_RECORD_TO_POLICE = 'DELIVER_CASE_FILES_RECORD_TO_POLICE',
  DELIVER_APPEAL_TO_POLICE = 'DELIVER_APPEAL_TO_POLICE',
  ARCHIVE_CASE_FILE = 'ARCHIVE_CASE_FILE',
  ARCHIVE_CASE_FILES_RECORD = 'ARCHIVE_CASE_FILES_RECORD',
  SEND_HEADS_UP_NOTIFICATION = 'SEND_HEADS_UP_NOTIFICATION',
  SEND_READY_FOR_COURT_NOTIFICATION = 'SEND_READY_FOR_COURT_NOTIFICATION',
  SEND_RECEIVED_BY_COURT_NOTIFICATION = 'SEND_RECEIVED_BY_COURT_NOTIFICATION',
  SEND_COURT_DATE_NOTIFICATION = 'SEND_COURT_DATE_NOTIFICATION',
  SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION = 'SEND_DEFENDANTS_NOT_UPDATED_AT_COURT_NOTIFICATION',
  SEND_RULING_NOTIFICATION = 'SEND_RULING_NOTIFICATION',
  SEND_MODIFIED_NOTIFICATION = 'SEND_MODIFIED_NOTIFICATION',
  SEND_REVOKED_NOTIFICATION = 'SEND_REVOKED_NOTIFICATION',
  SEND_DEFENDER_ASSIGNED_NOTIFICATION = 'SEND_DEFENDER_ASSIGNED_NOTIFICATION',
  SEND_APPEAL_TO_COURT_OF_APPEALS_NOTIFICATION = 'SEND_APPEAL_TO_COURT_OF_APPEALS_NOTIFICATION',
  SEND_APPEAL_RECEIVED_BY_COURT_NOTIFICATION = 'SEND_APPEAL_RECEIVED_BY_COURT_NOTIFICATION',
  SEND_APPEAL_STATEMENT_NOTIFICATION = 'SEND_APPEAL_STATEMENT_NOTIFICATION',
  SEND_APPEAL_COMPLETED_NOTIFICATION = 'SEND_APPEAL_COMPLETED_NOTIFICATION',
  SEND_APPEAL_JUDGES_ASSIGNED_NOTIFICATION = 'SEND_APPEAL_JUDGES_ASSIGNED_NOTIFICATION',
  SEND_APPEAL_CASE_FILES_UPDATED_NOTIFICATION = 'SEND_APPEAL_CASE_FILES_UPDATED_NOTIFICATION',
  SEND_APPEAL_WITHDRAWN_NOTIFICATION = 'SEND_APPEAL_WITHDRAWN_NOTIFICATION',
}

export type CaseMessage = {
  type: MessageType
  user: User
  caseId: string
  numberOfRetries?: number
  nextRetry?: number
}

export type DefendantMessage = CaseMessage & { defendantId: string }

export type CaseFileMessage = CaseMessage & { caseFileId: string }

export type PoliceCaseMessage = CaseMessage & { policeCaseNumber: string }
