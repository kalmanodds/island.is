import { Module } from '@nestjs/common'
import { DocumentResolver } from './document.resolver'
import { DocumentService } from './document.service'
import { DocumentsClientModule } from '@island.is/clients/documents'
import { DocumentBuilder } from './documentBuilder'

@Module({
  imports: [DocumentsClientModule],
  providers: [DocumentBuilder, DocumentResolver, DocumentService],
})
export class DocumentModule {}
