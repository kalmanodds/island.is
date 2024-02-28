import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'

import { CurrentUser, User } from '../auth'

import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { logger } from '@island.is/logging'
import { CreateVehicleInput } from './dto/createVehicle.input'
import { VehicleModel } from './vehicle.model'
import { VehicleService } from './vehicle.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => VehicleModel)
export class VehicleAppSysResolver {
  constructor(private vehicleService: VehicleService) {}

  @Mutation(() => Boolean)
  async createSkilavottordVehicleAppSys(
    @CurrentUser() user: User,
    @Args('input') input: CreateVehicleInput,
  ) {
    logger.info(`Creating Vehicle ${input.permno}`, {
      permno: input.permno,
      mileage: input.mileage,
      vehicle: input,
    })

    const newVehicle = new VehicleModel()
    newVehicle.vinNumber = input.vin
    newVehicle.newregDate = input.firstRegistrationDate
    newVehicle.vehicleColor = input.color
    newVehicle.vehicleType = input.make
    newVehicle.ownerNationalId = user.nationalId
    newVehicle.vehicleId = input.permno
    newVehicle.mileage = input.mileage

    return await this.vehicleService.create(newVehicle)
  }
}
