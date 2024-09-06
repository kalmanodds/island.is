import { Response } from 'express'

import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import {
  CurrentHttpUser,
  JwtAuthGuard,
  RolesGuard,
  RolesRules,
} from '@island.is/judicial-system/auth'
import {
  indictmentCases,
  ServiceRequirement,
  SubpoenaType,
  type User,
} from '@island.is/judicial-system/types'

import {
  districtCourtAssistantRule,
  districtCourtJudgeRule,
  districtCourtRegistrarRule,
  prosecutorRepresentativeRule,
  prosecutorRule,
  publicProsecutorStaffRule,
} from '../../guards'
import {
  Case,
  CaseExistsGuard,
  CaseReadGuard,
  CaseTypeGuard,
  CaseWriteGuard,
  CurrentCase,
  PdfService,
} from '../case'
import { CreateDefendantDto } from './dto/createDefendant.dto'
import { UpdateDefendantDto } from './dto/updateDefendant.dto'
import { CurrentDefendant } from './guards/defendant.decorator'
import { DefendantExistsGuard } from './guards/defendantExists.guard'
import { Defendant } from './models/defendant.model'
import { DeleteDefendantResponse } from './models/delete.response'
import { DefendantService } from './defendant.service'

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/case/:caseId/defendant')
@ApiTags('defendants')
export class DefendantController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly defendantService: DefendantService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @UseGuards(CaseExistsGuard, CaseWriteGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Post()
  @ApiCreatedResponse({
    type: Defendant,
    description: 'Creates a new defendant',
  })
  create(
    @Param('caseId') caseId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @Body() defendantToCreate: CreateDefendantDto,
  ): Promise<Defendant> {
    this.logger.debug(`Creating a new defendant for case ${caseId}`)

    return this.defendantService.create(theCase, defendantToCreate, user)
  }

  @UseGuards(CaseExistsGuard, CaseWriteGuard, DefendantExistsGuard)
  @RolesRules(
    prosecutorRule,
    prosecutorRepresentativeRule,
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
    publicProsecutorStaffRule,
  )
  @Patch(':defendantId')
  @ApiOkResponse({
    type: Defendant,
    description: 'Updates a defendant',
  })
  update(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Body() defendantToUpdate: UpdateDefendantDto,
  ): Promise<Defendant> {
    this.logger.debug(`Updating defendant ${defendantId} of case ${caseId}`)

    // If the defendant was present at the court hearing,
    // then set the verdict view date to the case ruling date
    if (
      defendantToUpdate.serviceRequirement === ServiceRequirement.NOT_APPLICABLE
    ) {
      defendantToUpdate = {
        ...defendantToUpdate,
        verdictViewDate: theCase.rulingDate,
      }
    }

    return this.defendantService.update(
      theCase,
      defendant,
      defendantToUpdate,
      user,
    )
  }

  @UseGuards(CaseExistsGuard, CaseWriteGuard, DefendantExistsGuard)
  @RolesRules(prosecutorRule, prosecutorRepresentativeRule)
  @Delete(':defendantId')
  @ApiOkResponse({ description: 'Deletes a defendant' })
  async delete(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentHttpUser() user: User,
    @CurrentCase() theCase: Case,
  ): Promise<DeleteDefendantResponse> {
    this.logger.debug(`Deleting defendant ${defendantId} of case ${caseId}`)

    const deleted = await this.defendantService.delete(
      theCase,
      defendantId,
      user,
    )

    return { deleted }
  }

  @UseGuards(
    CaseExistsGuard,
    new CaseTypeGuard(indictmentCases),
    CaseReadGuard,
    DefendantExistsGuard,
  )
  @RolesRules(
    districtCourtJudgeRule,
    districtCourtRegistrarRule,
    districtCourtAssistantRule,
  )
  @Get(':defendantId/subpoena')
  @Header('Content-Type', 'application/pdf')
  @ApiOkResponse({
    content: { 'application/pdf': {} },
    description: 'Gets the subpoena for a given defendant as a pdf document',
  })
  async getSubpoenaPdf(
    @Param('caseId') caseId: string,
    @Param('defendantId') defendantId: string,
    @CurrentCase() theCase: Case,
    @CurrentDefendant() defendant: Defendant,
    @Res() res: Response,
    @Query('arraignmentDate') arraignmentDate?: Date,
    @Query('location') location?: string,
    @Query('subpoenaType') subpoenaType?: SubpoenaType,
  ): Promise<void> {
    this.logger.debug(
      `Getting the subpoena for defendant ${defendantId} of case ${caseId} as a pdf document`,
    )

    const pdf = await this.pdfService.getSubpoenaPdf(
      theCase,
      defendant,
      arraignmentDate,
      location,
      subpoenaType,
    )

    res.end(pdf)
  }
}
