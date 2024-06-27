import { ApiProperty } from '@nestjs/swagger'
import { LanguageType } from '../../../../dataTypes/languageType.model'
import { FormApplicantDto } from '../../../applicants/models/dto/formApplicant.dto'
import { PageDto } from '../../../pages/models/dto/page.dto'
import { InputDto } from '../../../inputs/models/dto/input.dto'
import { SectionDto } from '../../../sections/models/dto/section.dto'
import { FormTestimonyTypeDto } from '../../../testimonies/models/dto/formTestimonyType.dto'
import { String } from 'aws-sdk/clients/apigateway'

export class FormDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  organizationId!: string

  @ApiProperty({ type: LanguageType })
  name!: LanguageType

  @ApiProperty()
  urlName!: string

  @ApiProperty()
  invalidationDate?: Date

  @ApiProperty()
  created!: Date

  @ApiProperty()
  modified!: Date

  @ApiProperty()
  isTranslated!: boolean

  @ApiProperty()
  applicationDaysToRemove!: number

  @ApiProperty()
  derivedFrom!: number

  @ApiProperty()
  stopProgressOnValidatingPage!: boolean

  @ApiProperty({ type: LanguageType })
  completedMessage?: LanguageType

  @ApiProperty({ type: [FormTestimonyTypeDto] })
  testimonyTypes?: FormTestimonyTypeDto[]

  @ApiProperty({ type: [FormApplicantDto] })
  applicants?: FormApplicantDto[]

  @ApiProperty({ type: [SectionDto] })
  sections?: SectionDto[]

  @ApiProperty({ type: [PageDto] })
  pages?: PageDto[]

  @ApiProperty({ type: [InputDto] })
  inputs?: InputDto[]
}
