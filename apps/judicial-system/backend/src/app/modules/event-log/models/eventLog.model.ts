import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { EventType } from '@island.is/judicial-system/types'

import { Case } from '../../case/models/case.model'

@Table({
  tableName: 'event_log',
  timestamps: false,
})
export class EventLog extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @CreatedAt
  @ApiProperty()
  created!: Date

  @Column({ type: DataType.STRING })
  @ApiProperty()
  eventType!: EventType

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: true })
  @ApiPropertyOptional()
  caseId?: string

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiPropertyOptional()
  nationalId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional()
  userRole?: string
}
