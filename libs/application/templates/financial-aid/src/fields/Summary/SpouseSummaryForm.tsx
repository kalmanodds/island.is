import React from 'react'

import { Box } from '@island.is/island-ui/core'

import * as m from '../../lib/messages'
import {
  ApproveOptions,
  FAFieldBaseProps,
  SummaryComment as SummaryCommentType,
} from '../../lib/types'
import { Routes } from '../../lib/constants'
import { DescriptionText } from '../index'
import { formatAddress, spouseFormItems } from '../../lib/formatters'
import { FormInfo, SummaryComment, UserInfo, ContactInfo, Files } from './index'

const SpouseSummaryForm = ({ application, goToScreen }: FAFieldBaseProps) => {
  const { id, answers, externalData } = application
  const summaryCommentType = SummaryCommentType.SPOUSEFORMCOMMENT

  return (
    <>
      <Box>
        <DescriptionText text={m.summaryForm.general.calculationsOverview} />
      </Box>

      <UserInfo
        name={externalData?.nationalRegistry?.data?.applicant?.spouse?.name}
        nationalId={
          externalData?.nationalRegistry?.data?.applicant?.spouse?.nationalId
        }
        address={formatAddress(externalData?.nationalRegistry?.data?.applicant)}
      />

      <FormInfo items={spouseFormItems(answers)} goToScreen={goToScreen} />

      <ContactInfo
        route={Routes.SPOUSECONTACTINFO}
        email={answers?.spouseContactInfo?.email}
        phone={answers?.spouseContactInfo?.phone}
        goToScreen={goToScreen}
      />

      <Files
        route={
          answers.spouseIncome === ApproveOptions.Yes
            ? Routes.SPOUSEINCOMEFILES
            : Routes.SPOUSETAXRETURNFILES
        }
        goToScreen={goToScreen}
        taxFiles={answers.spouseTaxReturnFiles}
        incomeFiles={answers.spouseIncomeFiles}
        applicationId={id}
      />

      <SummaryComment
        commentId={summaryCommentType}
        comment={answers?.spouseFormComment}
      />
    </>
  )
}

export default SpouseSummaryForm
