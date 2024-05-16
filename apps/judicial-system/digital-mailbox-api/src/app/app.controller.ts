import { Controller, Get, Inject, UseGuards } from '@nestjs/common'
import { ApiCreatedResponse } from '@nestjs/swagger'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { JwtAuthGuard } from './guards/auth.guard'
import { AppService } from './app.service'

@Controller('api')
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  @Get('test')
  @UseGuards(JwtAuthGuard)
  @ApiCreatedResponse({ type: String, description: 'Test connection' })
  async test(): Promise<string> {
    this.logger.debug('Testing connection')

    return this.appService.testConnection()
  }
}
