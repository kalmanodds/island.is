import max from 'lodash/max'
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute,
} from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { DEFAULT_DOMAIN } from '../../types'
import { DelegationDTO } from '../dto/delegation.dto'
import { DelegationScope } from './delegation-scope.model'
import { Domain } from '../../resources/models/domain.model'
import { MergedDelegationDTO } from '../dto/merged-delegation.dto'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'
import { DelegationDelegationType } from './delegation-delegation-type.model'

@Table({
  tableName: 'delegation',
  timestamps: false,
})
export class Delegation extends Model<
  InferAttributes<Delegation>,
  InferCreationAttributes<Delegation>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fromDisplayName!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  toNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  toName!: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  createdByNationalId?: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    defaultValue: DEFAULT_DOMAIN,
  })
  @ForeignKey(() => Domain)
  domainName!: CreationOptional<string>

  get validTo(): Date | null | undefined {
    // 1. Find a value with null as validTo. Null means that delegation scope set valid not to a specific time period
    const withNullValue = this.delegationScopes?.find((x) => x.validTo === null)
    if (withNullValue) {
      return null
    }

    // 2. Find items with value in the array
    const dates = (this.delegationScopes
      ?.filter((x) => x.validTo !== null && x.validTo !== undefined)
      .map((x) => x.validTo) || []) as Array<Date>

    // Return the max value
    return max(dates)
  }

  @CreatedAt
  readonly created!: CreationOptional<Date>

  @UpdatedAt
  readonly modified?: Date

  @HasMany(() => DelegationScope, { onDelete: 'cascade' })
  delegationScopes?: NonAttribute<DelegationScope[]>

  @HasMany(() => DelegationDelegationType, { onDelete: 'cascade' })
  delegationDelegationTypes?: DelegationDelegationType[]

  toDTO(type = AuthDelegationType.Custom): DelegationDTO {
    return {
      id: this.id,
      fromName: this.fromDisplayName,
      fromNationalId: this.fromNationalId,
      toNationalId: this.toNationalId,
      toName: this.toName,
      validTo: this.validTo,
      scopes: this.delegationScopes
        ? this.delegationScopes.map((scope) => scope.toDTO())
        : [],
      provider: AuthDelegationProvider.Custom,
      type: type,
      domainName: this.domainName,
    }
  }

  toMergedDTO(types = [AuthDelegationType.Custom]): MergedDelegationDTO {
    return {
      fromName: this.fromDisplayName,
      fromNationalId: this.fromNationalId,
      toNationalId: this.toNationalId,
      toName: this.toName,
      validTo: this.validTo,
      types: types,
      scopes: this.delegationScopes
        ? this.delegationScopes.map((scope) => scope.toDTO())
        : [],
    }
  }
}
