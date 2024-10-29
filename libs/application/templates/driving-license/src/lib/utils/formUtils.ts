import { getValueViaPath } from '@island.is/application/core'
import {
  FormValue,
  ApplicationContext,
  ExternalData,
} from '@island.is/application/types'
import { m } from '../messages'
import { ConditionFn, DrivingLicense } from '../types'
import {
  B_FULL,
  B_TEMP,
  DrivingLicenseApplicationFor,
  NO,
  YES,
} from '../constants'

export const allowFakeCondition =
  (result = YES) =>
  (answers: FormValue) =>
    getValueViaPath(answers, 'fakeData.useFakeData') === result

export const needsHealthCertificateCondition =
  (result = YES) =>
  (answers: FormValue, externalData: ExternalData) => {
    return (
      Object.values(answers?.healthDeclaration || {}).includes(result) ||
      answers?.hasHealthRemarks === result ||
      externalData.glassesCheck?.data === true
    )
  }

export const isVisible =
  (...fns: ConditionFn[]) =>
  (answers: FormValue) => {
    return fns.reduce((s, fn) => (!s ? false : fn(answers)), true)
  }

export const isApplicationForCondition =
  (result: DrivingLicenseApplicationFor | DrivingLicenseApplicationFor[]) =>
  (answers: FormValue) => {
    const strings = Array.isArray(result) ? result : [result]

    return strings.some(
      (x) => x === getValueViaPath(answers, 'applicationFor') ?? B_FULL,
    )
  }

export const hasNoDrivingLicenseInOtherCountry = (answers: FormValue) =>
  getValueViaPath(answers, 'otherCountry.drivingLicenseInOtherCountry') ===
    NO || true

export const chooseDistrictCommissionerDescription = ({
  answers,
}: {
  answers: FormValue
}) => {
  const applicationForTemp =
    getValueViaPath<DrivingLicenseApplicationFor>(
      answers,
      'applicationFor',
      B_FULL,
    ) === B_TEMP

  return applicationForTemp
    ? m.chooseDistrictCommissionerForTempLicense
    : m.chooseDistrictCommissionerForFullLicense
}

export const hasCompletedPrerequisitesStep =
  (value = false) =>
  ({ application }: ApplicationContext) => {
    const requirementsMet =
      getValueViaPath<boolean>(
        application.answers,
        'requirementsMet',
        false,
      ) === true
    return requirementsMet === value
  }

export const hasHealthRemarks = (externalData: ExternalData) => {
  return (
    (
      getValueViaPath<DrivingLicense>(externalData, 'currentLicense.data')
        ?.remarks || []
    ).length > 0
  )
}

export const joinWithAnd = (arr: string[], andString = 'og'): string => {
  if (arr.length === 0) return ''
  if (arr.length === 1) return arr[0]
  if (arr.length === 2) return arr.join(` ${andString} `)

  return `${arr.slice(0, -1).join(', ')}, ${andString} ${arr[arr.length - 1]}`
}
