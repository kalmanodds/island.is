import { Module } from '@nestjs/common'
import { FormSystemClientModule } from '@island.is/clients/form-system'
import { FormsService } from './forms/forms.service'
import { FormsResolver } from './forms/forms.resolver'
import { ApplicationsService } from './applications/applications.service'
import { ApplicationsResolver } from './applications/applications.resolver'
import { FieldsService } from './fields/fields.service'
import { FieldsResolver } from './fields/fields.resolver'
import { ListItemsService } from './listItems/listItems.service'
import { ListItemsResolver } from './listItems/listItems.resolver'
import { OrganizationsService } from './organizations/organizations.service'
import { OrganizationsResolver } from './organizations/organizations.resolver'
import { ScreensService } from './screens/screens.service'
import { ScreensResolver } from './screens/screens.resolver'
import { SectionsService } from './sections/sections.service'
import { SectionsResolver } from './sections/sections.resolver'

@Module({
  providers: [
    FormsService,
    FormsResolver,
    ApplicationsService,
    ApplicationsResolver,
    FieldsService,
    FieldsResolver,
    ListItemsService,
    ListItemsResolver,
    OrganizationsService,
    OrganizationsResolver,
    ScreensService,
    ScreensResolver,
    SectionsService,
    SectionsResolver,
  ],
  exports: [],
  imports: [FormSystemClientModule],
})
export class FormSystemModule { }
