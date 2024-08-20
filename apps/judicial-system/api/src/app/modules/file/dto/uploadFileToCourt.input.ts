import { Allow } from 'class-validator'

import { Field, ID, InputType } from '@nestjs/graphql'

@InputType()
export class UploadFileToCourtInput {
  @Allow()
  @Field(() => ID)
  readonly id!: string

  @Allow()
  @Field(() => ID)
  readonly caseId!: string
}
