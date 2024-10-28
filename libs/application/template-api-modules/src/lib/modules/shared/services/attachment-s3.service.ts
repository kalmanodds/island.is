import { getValueViaPath } from '@island.is/application/core'
import { ApplicationWithAttachments as Application } from '@island.is/application/types'
import { S3 } from 'aws-sdk'
import AmazonS3URI from 'amazon-s3-uri'
import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import { S3Service } from '@island.is/nest/aws'

export interface AttachmentData {
  key: string
  answerKey: string
  fileContent: string
  fileName: string
}

@Injectable()
export class AttachmentS3Service {
  constructor(
    private readonly s3Service: S3Service,
  ) 
  {}

  public async getFiles(
    application: Application,
    attachmentAnswerKeys: string[],
  ): Promise<AttachmentData[]> {
    const attachments: AttachmentData[] = []

    for (const key of attachmentAnswerKeys) {
      const answers = getValueViaPath(application.answers, key) as Array<{
        key: string
        name: string
      }>
      if (!answers) continue
      const list = await this.toDocumentDataList(answers, key, application)
      attachments.push(...list)
    }
    return attachments
  }

  private async toDocumentDataList(
    answers: Array<{
      key: string
      name: string
    }>,
    answerKey: string,
    application: Application,
  ): Promise<AttachmentData[]> {
    return await Promise.all(
      answers.map(async ({ key, name }) => {
        const url = (
          application.attachments as {
            [key: string]: string
          }
        )[key]

        if (!url) {
          logger.info('Failed to get url from application state')
          return { key: '', fileContent: '', answerKey, fileName: '' }
        }
        const fileContent =
          (await this.s3Service.getFileContent(url, 'base64')) ?? ''

        return { key, fileContent, answerKey, fileName: name }
      }),
    )
  }
}
