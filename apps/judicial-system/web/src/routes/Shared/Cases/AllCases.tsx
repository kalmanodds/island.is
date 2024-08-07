import React, { FC, useContext } from 'react'

import { isPublicProsecutorUser } from '@island.is/judicial-system/types'
import { UserContext } from '@island.is/judicial-system-web/src/components'

import PublicProsecutorCases from '../../PublicProsecutor/Cases/PublicProsecutorCases'
import Cases from './Cases'

export const AllCases: FC = () => {
  const { user } = useContext(UserContext)

  if (isPublicProsecutorUser(user)) {
    return <PublicProsecutorCases />
  }

  return <Cases />
}

export default AllCases
