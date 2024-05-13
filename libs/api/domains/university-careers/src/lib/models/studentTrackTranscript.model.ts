import { ObjectType, Field, Int } from '@nestjs/graphql'
import { Institution } from './institution.model'

@ObjectType('UniversityCareersStudentTrackTranscript')
export class StudentTrackTranscript {
  @Field()
  name!: string

  @Field({ nullable: true })
  nationalId?: string

  @Field()
  graduationDate!: string

  @Field(() => Int)
  trackNumber!: number

  @Field(() => Institution, { nullable: true })
  institution?: Institution

  @Field()
  school!: string

  @Field()
  faculty!: string

  @Field()
  studyProgram!: string

  @Field()
  degree!: string
}
