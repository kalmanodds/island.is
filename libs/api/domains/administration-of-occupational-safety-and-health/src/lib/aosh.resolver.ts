import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import {
  MachineDetails,
  MachineDetailsInput,
} from './graphql/machineDetails.input'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { AoshApi } from './aosh.service'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'
import { ChangeMachineOwner } from './graphql/ownerChange.input'
import { ConfirmOwnerChange } from './graphql/confirmOwnerChange.input'
import { ChangeMachineSupervisor } from './graphql/changeMachineSupervisor.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class AoshResolver {
  constructor(private readonly aoshApi: AoshApi) {}

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => MachineDetails)
  @Audit()
  async machineDetails(
    @CurrentUser() auth: User,
    @Args('input') input: MachineDetailsInput,
  ) {
    return await this.aoshApi.getMachineDetails(auth, input.id)
  }

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => Boolean)
  @Audit()
  async isPaymentRequired(
    @CurrentUser() auth: User,
    @Args('input') regNumber: string,
  ) {
    return await this.aoshApi.isPaymentRequired(auth, regNumber)
  }

  @Mutation(() => Boolean)
  async changeMachineOwner(
    @CurrentUser() auth: User,
    @Args('input') input: ChangeMachineOwner,
  ): Promise<boolean> {
    try {
      await this.aoshApi.changeMachineOwner(auth, input)
      return true // Operation was successful
    } catch (error) {
      console.log('changeOwnerChange Error: ', error)
      // Handle errors here
      return false // Operation failed
    }
  }

  @Mutation(() => Boolean)
  async confirmOwnerChange(
    @CurrentUser() auth: User,
    @Args('input') input: ConfirmOwnerChange,
  ): Promise<boolean> {
    try {
      await this.aoshApi.confirmOwnerChange(auth, input)
      return true // Operation was successful
    } catch (error) {
      console.log('confirmOwnerChange Error: ', error)
      // Handle errors here
      return false // Operation failed
    }
  }

  //   @Mutation(() => Boolean)
  //   async changeMachineSupervisor(
  //     @CurrentUser() auth: User,
  //     @Args('input') input: ChangeMachineSupervisor,
  //   ): Promise<boolean> {
  //     try {
  //       await this.aoshApi.changeMachineSupervisor(auth, input)
  //       return true // Operation was successful
  //     } catch (error) {
  //       console.log('changeMachineSupervisor Error: ', error)
  //       // Handle errors here
  //       return false // Operation failed
  //     }
  //   }
}
