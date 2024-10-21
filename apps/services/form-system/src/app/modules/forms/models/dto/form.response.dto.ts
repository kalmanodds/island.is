import { ApiPropertyOptional } from '@nestjs/swagger'
import { FieldTypeDto } from '../../../fields/models/dto/fieldType.dto'
import { ListTypeDto } from '../../../lists/models/dto/listType.dto'
import { FormCertificationDto } from '../../../formCertifications/models/dto/formCertification.dto'
import { FormDto } from './form.dto'

export class FormResponseDto {
  @ApiPropertyOptional({ type: FormDto })
  form?: FormDto

  @ApiPropertyOptional({ type: [FieldTypeDto] })
  fieldTypes?: FieldTypeDto[]

  @ApiPropertyOptional({ type: [FormCertificationDto] })
  certificationTypes?: FormCertificationDto[]

  @ApiPropertyOptional({ type: [ListTypeDto] })
  listTypes?: ListTypeDto[]

  @ApiPropertyOptional({ type: [FormDto] })
  forms?: FormDto[]
}
