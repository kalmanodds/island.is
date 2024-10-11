import { Module } from '@nestjs/common'
import { SharedTemplateAPIModule } from '../../shared'
import { ConfigModule } from '@nestjs/config'
import {
  FinancialStatementsInaoClientConfig,
  FinancialStatementsInaoClientModule,
} from '@island.is/clients/financial-statements-inao'
import { FinancialStatementCemeteryTemplateService } from './financial-statement-cemetery.service'

@Module({
  imports: [
    SharedTemplateAPIModule,
    ConfigModule.forRoot({
      load: [FinancialStatementsInaoClientConfig],
    }),
    FinancialStatementsInaoClientModule,
  ],
  providers: [FinancialStatementCemeteryTemplateService],
  exports: [FinancialStatementCemeteryTemplateService],
})
export class FinancialStatementCemeteryTemplateModule {}
