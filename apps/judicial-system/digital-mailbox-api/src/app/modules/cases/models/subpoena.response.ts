import { ApiProperty } from '@nestjs/swagger'

import { formatNationalId } from '@island.is/judicial-system/formatters'
import { DefenderChoice } from '@island.is/judicial-system/types'

import { InternalCaseResponse } from './internal/internalCase.response'

class DefenderInfo {
  @ApiProperty({ enum: () => DefenderChoice })
  defenderChoice?: DefenderChoice

  @ApiProperty({ type: () => String })
  defenderName?: string
}

export class SubpoenaResponse {
  @ApiProperty({ type: () => String })
  caseId!: string

  @ApiProperty({ type: () => DefenderInfo })
  defenderInfo?: DefenderInfo

  static fromInternalCaseResponse(
    internalCase: InternalCaseResponse,
    defendantNationalId: string,
    lang?: string,
  ): SubpoenaResponse {
    const formattedNationalId = formatNationalId(defendantNationalId)
    const title = lang === 'en' ? 'Subpoena' : 'Fyrirkall' //TODO add subpoena info to response

    const defendantInfo = internalCase.defendants.find(
      (defendant) =>
        defendant.nationalId === formattedNationalId ||
        defendant.nationalId === defendantNationalId,
    )

    return {
      caseId: internalCase.id,
      defenderInfo: defendantInfo
        ? {
            defenderChoice: defendantInfo?.defenderChoice,
            defenderName: defendantInfo?.defenderName,
          }
        : undefined,
    }
  }
}
