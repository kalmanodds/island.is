import { CreationOptional, NonAttribute } from 'sequelize'
import {
  BelongsToMany,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Section } from '../../sections/models/section.model'
import { Organization } from '../../organizations/models/organization.model'
import { LanguageType } from '../../../dataTypes/languageType.model'
import { FormApplicant } from '../../formApplicants/models/formApplicant.model'
// import { Certification } from '../../certifications/models/certification.model'
import { Dependency } from '../../../dataTypes/dependency.model'
import { FormCertification } from '../../formCertifications/models/formCertification.model'

@Table({ tableName: 'form' })
export class Form extends Model<Form> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: new LanguageType(),
  })
  name!: LanguageType

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    defaultValue: DataType.UUIDV4,
  })
  slug!: string

  @Column
  invalidationDate?: Date

  @CreatedAt
  created!: CreationOptional<Date>

  @UpdatedAt
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isTranslated!: boolean

  @Column({
    type: DataType.INTEGER,
    defaultValue: 60,
  })
  applicationDaysToRemove!: number

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  derivedFrom!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  isPublishedInChanging!: boolean

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  stopProgressOnValidatingScreen!: boolean

  @Column({
    type: DataType.JSON,
    allowNull: true,
    defaultValue: () => new LanguageType(),
  })
  completedMessage?: LanguageType

  @Column({
    type: DataType.JSON,
    allowNull: true,
  })
  dependencies?: Dependency[]

  @HasMany(() => Section)
  sections!: Section[]

  @HasMany(() => FormApplicant)
  applicants?: FormApplicant[]

  @HasMany(() => FormCertification)
  certifications?: FormCertification[]

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'organization_id',
  })
  organizationId!: string
}
