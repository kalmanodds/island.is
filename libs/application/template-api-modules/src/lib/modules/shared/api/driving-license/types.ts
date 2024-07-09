export type HasQualityPhoto = {
  hasQualityPhoto: boolean
}
export type HasQualitySignature = {
  hasQualitySignature: boolean
}

export const YES = 'yes'
export const NO = 'no'

type FakeCurrentLicense = 'none' | 'temp'
type YesOrNo = 'yes' | 'no'

export interface DrivingLicenseFakeData {
  useFakeData?: YesOrNo
  qualityPhoto?: YesOrNo
  currentLicense?: FakeCurrentLicense
  remarks?: YesOrNo
}

export type DrivingLicenseCategory = {
  id: number
  name: string
  issued: Date | null
  expires: Date | null
  comments: string | null
  validToText?: string | null
  validToCode?: number | null
  nr?: string | null
}

export interface Remark {
  code: string
  description: string
}

export type DrivingLicense = {
  currentLicense: string | null
  remarks?: Remark[]
  categories?: DrivingLicenseCategory[]
  id?: number
  birthCountry?: string | null
  issued?: Date | null
  expires?: Date | null
  publishPlaceName?: string | null
}

export interface StudentAssessment {
  studentNationalId: string
  teacherNationalId: string
  teacherName: string | null
}
