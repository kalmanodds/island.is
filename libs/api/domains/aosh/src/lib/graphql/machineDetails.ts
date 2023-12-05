import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType()
export class AoshMachineDetails {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  registrationNumber?: string | null

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => String, { nullable: true })
  category?: string | null

  @Field(() => String, { nullable: true })
  subCategory?: string | null

  @Field(() => Number, { nullable: true })
  productionYear?: number | null

  @Field(() => String, { nullable: true })
  registrationDate?: string | null

  @Field(() => String, { nullable: true })
  ownerNumber?: string | null

  @Field(() => String, { nullable: true })
  productionNumber?: string | null

  @Field(() => String, { nullable: true })
  productionCountry?: string | null

  @Field(() => String, { nullable: true })
  licensePlateNumber?: string | null

  @Field(() => [AoshMachineLinks], { nullable: true })
  links?: [AoshMachineLinks] | null
}

@ObjectType()
class AoshMachineLinks {
  @Field(() => String, { nullable: true })
  href?: string

  @Field(() => String, { nullable: true })
  rel?: string

  @Field(() => String, { nullable: true })
  method?: string

  @Field(() => String, { nullable: true })
  displayTitle?: string
}
