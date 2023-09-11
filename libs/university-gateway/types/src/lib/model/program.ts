import { DegreeType, ModeOfDelivery, Season } from '../types'
import { ITag } from './tag'
import { IProgramExtraApplicationField } from './programExtraApplicationField'

export interface IProgram {
  externalId: string
  nameIs: string
  nameEn: string
  departmentNameIs: string
  departmentNameEn: string
  startingSemesterYear: number
  startingSemesterSeason: Season
  applicationStartDate: Date
  applicationEndDate: Date
  degreeType: DegreeType
  degreeAbbreviation: string
  credits: number
  descriptionIs: string
  descriptionEn: string
  durationInYears: number
  costPerYear?: number
  iscedCode: string
  searchKeywords: string[]
  externalUrlIs?: string
  externalUrlEn?: string
  admissionRequirementsIs?: string
  admissionRequirementsEn?: string
  studyRequirementsIs?: string
  studyRequirementsEn?: string
  costInformationIs?: string
  costInformationEn?: string
  tag?: ITag[]
  modeOfDelivery: ModeOfDelivery[]
  extraApplicationField?: IProgramExtraApplicationField[]
}
