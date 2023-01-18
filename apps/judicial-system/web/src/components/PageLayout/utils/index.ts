import { IntlFormatters } from 'react-intl'

import {
  Case,
  CaseDecision,
  CaseState,
  CaseType,
  isIndictmentCase,
  isInvestigationCase,
} from '@island.is/judicial-system/types'
import { sections as m } from '@island.is/judicial-system-web/messages'

export const caseResult = (
  formatMessage: IntlFormatters['formatMessage'],
  workingCase?: Case,
): string => {
  if (!workingCase) {
    return ''
  }

  const isAccepted =
    workingCase.state === CaseState.Accepted ||
    workingCase?.parentCase?.state === CaseState.Accepted

  /**
   * No need to check the parent case state because you can't extend
   * travel ban cases, dissmissed or rejected cases
   */
  const isRejected = workingCase?.state === CaseState.Rejected
  const isDismissed = workingCase.state === CaseState.Dismissed
  let caseType = workingCase.type

  if (isRejected) {
    return formatMessage(m.caseResults.rejectedV2, {
      isInvestigationCase: isInvestigationCase(caseType),
    })
  } else if (isAccepted) {
    if (isInvestigationCase(caseType)) {
      return formatMessage(m.caseResults.investigationAccepted)
    } else if (isIndictmentCase(caseType)) {
      return formatMessage(m.caseResults.indictmentClosed)
    } else {
      const isAlternativeTravelBan =
        workingCase.state === CaseState.Accepted &&
        workingCase.decision === CaseDecision.AcceptingAlternativeTravelBan
      caseType = isAlternativeTravelBan ? CaseType.TravelBan : caseType
      return workingCase?.isValidToDateInThePast
        ? formatMessage(m.caseResults.restrictionOver, { caseType })
        : formatMessage(m.caseResults.restrictionActive, { caseType })
    }
  } else if (isDismissed) {
    return formatMessage(m.caseResults.dissmissed)
  } else {
    return formatMessage(m.caseResults.result)
  }
}
