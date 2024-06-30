import React, { FC, useContext } from 'react'
import { useIntl } from 'react-intl'

import { Box, Text } from '@island.is/island-ui/core'
import {
  formatDate,
  FormatPattern,
} from '@island.is/judicial-system/formatters'

import {
  CaseAppealDecision,
  CaseAppealState,
  InstitutionType,
  UserRole,
} from '../../graphql/schema'
import { FormContext } from '../FormProvider/FormProvider'
import OverviewHeader from '../OverviewHeader/OverviewHeader'
import RestrictionTags from '../RestrictionTags/RestrictionTags'
import RulingDateLabel from '../RulingDateLabel/RulingDateLabel'
import { UserContext } from '../UserProvider/UserProvider'
import { CaseTitleInfoAndTags as strings } from './CaseTitleInfoAndTags.strings'

const CaseTitleInfoAndTags: FC = () => {
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const { user } = useContext(UserContext)

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      flexDirection={['columnReverse', 'columnReverse', 'columnReverse', 'row']}
      marginBottom={3}
    >
      <Box>
        <OverviewHeader />
        {workingCase.rulingDate && (
          <RulingDateLabel rulingDate={workingCase.rulingDate} />
        )}
        {workingCase.appealedDate && (
          <>
            <Box marginTop={1}>
              <Text as="h5" variant="h5">
                {workingCase.prosecutorAppealDecision ===
                  CaseAppealDecision.APPEAL ||
                workingCase.accusedAppealDecision === CaseAppealDecision.APPEAL
                  ? formatMessage(strings.appealedByInCourt, {
                      appealedByProsecutor:
                        workingCase.appealedByRole === UserRole.PROSECUTOR,
                    })
                  : formatMessage(strings.appealedBy, {
                      appealedByProsecutor:
                        workingCase.appealedByRole === UserRole.PROSECUTOR,
                      appealedDate: `${formatDate(
                        workingCase.appealedDate,
                        FormatPattern.dMMMYHHmm,
                      )}`,
                    })}
              </Text>
            </Box>
            {((user?.institution?.type === InstitutionType.DISTRICT_COURT &&
              workingCase.appealState === CaseAppealState.COMPLETED) ||
              user?.institution?.type === InstitutionType.COURT_OF_APPEALS) &&
              workingCase.appealReceivedByCourtDate && (
                <Box marginTop={1}>
                  <Text as="h5" variant="h5">
                    {formatMessage(
                      user.institution.type === InstitutionType.COURT_OF_APPEALS
                        ? strings.COAAppealReceivedAt
                        : strings.appealReceivedAt,
                      {
                        appealReceived: formatDate(
                          workingCase.appealReceivedByCourtDate,
                          FormatPattern.dMMMYHHmm,
                        ),
                      },
                    )}
                  </Text>
                </Box>
              )}
          </>
        )}
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        marginLeft={[0, 0, 0, 1]}
        marginBottom={[1, 1, 1, 0]}
      >
        <RestrictionTags workingCase={workingCase} />
      </Box>
    </Box>
  )
}

export default CaseTitleInfoAndTags
