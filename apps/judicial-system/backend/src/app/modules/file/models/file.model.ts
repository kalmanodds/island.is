import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import {
  CaseFileCategory,
  CaseFileState,
} from '@island.is/judicial-system/types'

// TODO Find a way to import from an index file
import { Case } from '../../case/models/case.model'

@Table({
  tableName: 'case_file',
  timestamps: true,
})
export class CaseFile extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty({ type: String })
  id!: string

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: Date

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: Date

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  caseId!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  name!: string

  @Column({ type: DataType.STRING, allowNull: false })
  @ApiProperty({ type: String })
  type!: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(CaseFileCategory),
  })
  @ApiPropertyOptional({ enum: CaseFileCategory })
  category?: CaseFileCategory

  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: Object.values(CaseFileState),
  })
  @ApiProperty({ enum: CaseFileState })
  state!: CaseFileState

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  key?: string

  @Column({ type: DataType.INTEGER, allowNull: false })
  @ApiProperty({ type: Number })
  size!: number

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  policeCaseNumber?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  userGeneratedFilename?: string

  @Column({ type: DataType.INTEGER, allowNull: true })
  @ApiPropertyOptional({ type: Number })
  chapter?: number

  @Column({ type: DataType.INTEGER, allowNull: true })
  @ApiPropertyOptional({ type: Number })
  orderWithinChapter?: number

  @Column({ type: DataType.DATE, allowNull: true })
  @ApiPropertyOptional({ type: Date })
  displayDate?: Date

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  policeFileId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  hash?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  submittedBy?: string
}
