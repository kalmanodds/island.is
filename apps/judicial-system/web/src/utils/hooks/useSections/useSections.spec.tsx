import React from 'react'
import { IntlProvider } from 'react-intl'
import faker from 'faker'
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { renderHook } from '@testing-library/react'

import {
  Case,
  CaseState,
  CaseType,
  InstitutionType,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import { UserProvider } from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealRulingDecision,
  CaseAppealState,
  CaseOrigin,
} from '@island.is/judicial-system-web/src/graphql/schema'

import useSections from './index'

jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '',
    }
  },
}))

describe('useSections getSections', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const wrapper = ({ children }: any) => (
    <IntlProvider locale="is" onError={jest.fn}>
      <ApolloProvider client={new ApolloClient({ cache: new InMemoryCache() })}>
        <UserProvider authenticated={true}>{children}</UserProvider>
      </ApolloProvider>
    </IntlProvider>
  )

  const u: User = {
    created: faker.date.past().toISOString(),
    modified: faker.date.past().toISOString(),
    id: faker.datatype.uuid(),
    nationalId: '0000000000',
    name: faker.name.firstName(),
    title: faker.name.jobType(),
    mobileNumber: faker.phone.phoneNumber(),
    role: UserRole.PROSECUTOR,
    email: faker.internet.email(),
    active: true,
    institution: {
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      name: faker.company.companyName(),
      active: true,
      type: InstitutionType.PROSECUTORS_OFFICE,
    },
  }

  const generateSubsteps = (count: number) => {
    if (count < 1) {
      return []
    }

    return [...Array(count).keys()].map((_, i) => ({
      href: expect.any(String),
      name: expect.any(String),
      isActive: expect.any(Boolean),
      ...(i > 0 && { onClick: undefined }),
    }))
  }

  it('should return the correct sections for restriction cases in DRAFT state', () => {
    const { result } = renderHook(() => useSections(), { wrapper })
    const c: Case = {
      origin: CaseOrigin.RVG,
      type: CaseType.CUSTODY,
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      state: CaseState.DRAFT,
      policeCaseNumbers: [],
    }

    expect(result.current.getSections(c, u)).toStrictEqual([
      {
        children: generateSubsteps(6),
        isActive: true,
        name: expect.any(String),
      },
      {
        children: [],
        isActive: false,
        name: expect.any(String),
      },
      { children: [], isActive: false, name: expect.any(String) },
    ])
  })

  // TODO: Remove .skip when the Court of Appeals is ready
  it.skip('should return the correct sections for appealed restriction cases when the court of appeals has made a ruling', () => {
    const { result } = renderHook(() => useSections(), { wrapper })
    const c: Case = {
      origin: CaseOrigin.RVG,
      type: CaseType.CUSTODY,
      created: faker.date.past().toISOString(),
      modified: faker.date.past().toISOString(),
      id: faker.datatype.uuid(),
      state: CaseState.ACCEPTED,
      policeCaseNumbers: [],
      appealState: CaseAppealState.COMPLETED,
      appealRulingDecision: CaseAppealRulingDecision.REMAND,
    }

    expect(result.current.getSections(c, u)).toStrictEqual([
      {
        children: generateSubsteps(6),
        isActive: false,
        name: expect.any(String),
      },
      { children: [], isActive: false, name: expect.any(String) },
      { children: [], isActive: false, name: expect.any(String) },
      { children: [], isActive: false, name: expect.any(String) },
      {
        children: generateSubsteps(3),
        isActive: false,
        name: expect.any(String),
      },
      { children: [], isActive: true, name: 'Heimvísun' },
    ])
  })
})
