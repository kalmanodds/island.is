import type { User } from '@island.is/judicial-system/types'

export enum MessageType {
  DELIVERY_TO_COURT_PROSECUTOR = 'DELIVERY_TO_COURT_PROSECUTOR',
  DELIVERY_TO_COURT_DEFENDANT = 'DELIVERY_TO_COURT_DEFENDANT',
  DELIVERY_TO_COURT_INDICTMENT = 'DELIVERY_TO_COURT_INDICTMENT',
  DELIVERY_TO_COURT_INDICTMENT_INFO = 'DELIVERY_TO_COURT_INDICTMENT_INFO',
  DELIVERY_TO_COURT_INDICTMENT_COURT_ROLES = 'DELIVERY_TO_COURT_INDICTMENT_COURT_ROLES',
  DELIVERY_TO_COURT_INDICTMENT_DEFENDER = 'DELIVERY_TO_COURT_INDICTMENT_DEFENDER',
  DELIVERY_TO_COURT_INDICTMENT_CANCELLATION_NOTICE = 'DELIVERY_TO_COURT_INDICTMENT_CANCELLATION_NOTICE',
  DELIVERY_TO_COURT_CASE_FILE = 'DELIVERY_TO_COURT_CASE_FILE',
  DELIVERY_TO_COURT_CASE_FILES_RECORD = 'DELIVERY_TO_COURT_CASE_FILES_RECORD',
  DELIVERY_TO_COURT_REQUEST = 'DELIVERY_TO_COURT_REQUEST',
  DELIVERY_TO_COURT_COURT_RECORD = 'DELIVERY_TO_COURT_COURT_RECORD',
  DELIVERY_TO_COURT_SIGNED_RULING = 'DELIVERY_TO_COURT_SIGNED_RULING',
  DELIVERY_TO_COURT_CASE_CONCLUSION = 'DELIVERY_TO_COURT_CASE_CONCLUSION',
  DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE = 'DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE',
  DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES = 'DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES',
  DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE = 'DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE',
  DELIVERY_TO_COURT_OF_APPEALS_CONCLUSION = 'DELIVERY_TO_COURT_OF_APPEALS_CONCLUSION',
  DELIVERY_TO_POLICE_CASE = 'DELIVERY_TO_POLICE_CASE',
  DELIVERY_TO_POLICE_INDICTMENT_CASE = 'DELIVERY_TO_POLICE_INDICTMENT_CASE',
  DELIVERY_TO_POLICE_INDICTMENT = 'DELIVERY_TO_POLICE_INDICTMENT',
  DELIVERY_TO_POLICE_CASE_FILES_RECORD = 'DELIVERY_TO_POLICE_CASE_FILES_RECORD',
  DELIVERY_TO_POLICE_SUBPOENA = 'DELIVERY_TO_POLICE_SUBPOENA',
  DELIVERY_TO_POLICE_SIGNED_RULING = 'DELIVERY_TO_POLICE_SIGNED_RULING',
  DELIVERY_TO_POLICE_APPEAL = 'DELIVERY_TO_POLICE_APPEAL',
  NOTIFICATION = 'NOTIFICATION',
  SUBPOENA_NOTIFICATION = 'SUBPOENA_NOTIFICATION',
  INSTITUTION_NOTIFICATION = 'INSTITUTION_NOTIFICATION',
  NOTIFICATION_DISPATCH = 'NOTIFICATION_DISPATCH',
}

export const messageEndpoint: { [key in MessageType]: string } = {
  DELIVERY_TO_COURT_PROSECUTOR: 'deliverProsecutorToCourt',
  DELIVERY_TO_COURT_DEFENDANT: 'deliverDefendantToCourt',
  DELIVERY_TO_COURT_INDICTMENT: 'deliverIndictmentToCourt',
  DELIVERY_TO_COURT_INDICTMENT_COURT_ROLES:
    'deliverIndictmentCourtRolesToCourt',
  DELIVERY_TO_COURT_INDICTMENT_INFO: 'deliverIndictmentInfoToCourt',
  DELIVERY_TO_COURT_INDICTMENT_DEFENDER: 'deliverIndictmentDefenderToCourt',
  DELIVERY_TO_COURT_INDICTMENT_CANCELLATION_NOTICE:
    'deliverIndictmentCancellationNoticeToCourt',
  DELIVERY_TO_COURT_CASE_FILE: 'deliverCaseFileToCourt',
  DELIVERY_TO_COURT_CASE_FILES_RECORD: 'deliverCaseFilesRecordToCourt',
  DELIVERY_TO_COURT_REQUEST: 'deliverRequestToCourt',
  DELIVERY_TO_COURT_COURT_RECORD: 'deliverCourtRecordToCourt',
  DELIVERY_TO_COURT_SIGNED_RULING: 'deliverSignedRulingToCourt',
  DELIVERY_TO_COURT_CASE_CONCLUSION: 'deliverCaseConclusionToCourt',
  DELIVERY_TO_COURT_OF_APPEALS_RECEIVED_DATE:
    'deliverReceivedDateToCourtOfAppeals',
  DELIVERY_TO_COURT_OF_APPEALS_ASSIGNED_ROLES:
    'deliverAssignedRolesToCourtOfAppeals',
  DELIVERY_TO_COURT_OF_APPEALS_CASE_FILE: 'deliverCaseFileToCourtOfAppeals',
  DELIVERY_TO_COURT_OF_APPEALS_CONCLUSION: 'deliverConclusionToCourtOfAppeals',
  DELIVERY_TO_POLICE_CASE: 'deliverCaseToPolice',
  DELIVERY_TO_POLICE_INDICTMENT_CASE: 'deliverIndictmentCaseToPolice',
  DELIVERY_TO_POLICE_INDICTMENT: 'deliverIndictmentToPolice',
  DELIVERY_TO_POLICE_CASE_FILES_RECORD: 'deliverCaseFilesRecordToPolice',
  DELIVERY_TO_POLICE_SUBPOENA: 'deliverSubpoenaToPolice',
  DELIVERY_TO_POLICE_SIGNED_RULING: 'deliverSignedRulingToPolice',
  DELIVERY_TO_POLICE_APPEAL: 'deliverAppealToPolice',
  NOTIFICATION: 'notification',
  SUBPOENA_NOTIFICATION: 'subpoenaNotification',
  INSTITUTION_NOTIFICATION: 'institutionNotification',
  NOTIFICATION_DISPATCH: 'notification/dispatch',
}

export type Message = {
  type: MessageType
  user?: User
  caseId?: string
  elementId?: string | string[]
  body?: { [key: string]: unknown }
  numberOfRetries?: number
  nextRetry?: number
}
