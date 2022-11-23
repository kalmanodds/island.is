import React, { FC } from 'react'

import { useLocale, withClientLocale } from '@island.is/localization'
import { m, DynamicWrapper } from '@island.is/service-portal/core'

import DocumentScreen from '../../components/DocumentScreen/DocumentScreen'

const EmployeeClaims: FC = () => {
  const { formatMessage } = useLocale()

  return (
    <DynamicWrapper>
      <DocumentScreen
        title={formatMessage(m.financeEmployeeClaims)}
        intro={formatMessage({
          id: 'sp.employee-claims:intro',
          defaultMessage:
            'Hér er að finna opinber gjöld utan staðgreiðslu sem dregin eru af starfsmönnum.',
        })}
        listPath="employeeClaims"
        defaultDateRangeMonths={12}
      />
    </DynamicWrapper>
  )
}

export default withClientLocale('sp.employee-claims')(EmployeeClaims)
