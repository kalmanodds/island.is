import {
  buildAlertMessageField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Application } from '@island.is/api/schema'
import {
  PostCodeDto,
  SizeOfTheEnterpriseDto,
} from '@island.is/clients/work-accident-ver'
import { FormValue } from '@island.is/application/types'

export const companySection = buildSubSection({
  id: 'company',
  title: information.labels.company.sectionTitle,
  children: [
    buildMultiField({
      id: 'companyInformation',
      title: information.general.pageTitle,
      description: information.general.description,
      children: [
        buildHiddenInput({
          id: 'employeeAmount',
          doesNotRequireAnswer: true,
          defaultValue: (application: Application) => {
            const employeeAmount = getValueViaPath(
              application.answers,
              'employeeAmount',
              1,
            ) as number
            return employeeAmount
          },
        }),
        buildDescriptionField({
          id: 'companyInformation.description',
          title: information.labels.company.descriptionField,
          titleVariant: 'h5',
        }),
        buildTextField({
          id: 'companyInformation.nationalId',
          title: information.labels.company.nationalId,
          backgroundColor: 'white',
          width: 'half',
          format: '######-####',
          readOnly: true,
          defaultValue: (application: Application) => {
            const nationalId = getValueViaPath(
              application.externalData,
              'identity.data.nationalId',
              undefined,
            ) as string | undefined

            return nationalId
          },
        }),
        buildTextField({
          id: 'companyInformation.name',
          title: information.labels.company.name,
          backgroundColor: 'white',
          width: 'half',
          defaultValue: (application: Application) => {
            const name = getValueViaPath(
              application.externalData,
              'identity.data.name',
              undefined,
            ) as string | undefined

            return name
          },
        }),
        buildTextField({
          id: 'companyInformation.address',
          title: information.labels.company.address,
          backgroundColor: 'white',
          width: 'half',
          defaultValue: (application: Application) => {
            const streetAddress = getValueViaPath(
              application.externalData,
              'identity.data.address.streetAddress',
              undefined,
            ) as string | undefined

            return streetAddress
          },
        }),
        buildTextField({
          id: 'companyInformation.postnumber',
          title: information.labels.company.postNumberAndTown,
          backgroundColor: 'white',
          width: 'half',
          defaultValue: (application: Application) => {
            const postalCode = getValueViaPath(
              application.externalData,
              'identity.data.address.postalCode',
              undefined,
            ) as string | undefined
            const city = getValueViaPath(
              application.externalData,
              'identity.data.address.city',
              undefined,
            ) as string | undefined

            return `${postalCode} - ${city}`
          },
        }),
        buildSelectField({
          id: 'companyInformation.numberOfEmployees',
          title: information.labels.company.numberOfEmployees,
          width: 'half',
          required: true,
          defaultValue: (application: Application) => {
            const type = getValueViaPath(
              application.externalData,
              'identity.data.type',
              undefined,
            ) as string | undefined
            if (type === 'person') return '0'
            return undefined
          },
          options: (application) => {
            const sizeOfEnterprises = getValueViaPath(
              application.externalData,
              'aoshData.data.sizeOfTheEnterprise',
              [],
            ) as SizeOfTheEnterpriseDto[]

            return sizeOfEnterprises
              .filter((size) => size?.code && size?.name)
              .map(({ code, name }) => ({
                label: name || '',
                value: code || '',
              }))
          },
        }),
        buildAlertMessageField({
          id: 'company.alertMessageField',
          title: '',
          message: information.labels.company.alertMessage,
          alertType: 'info',
          doesNotRequireAnswer: true,
          condition: (formValue: FormValue, externalData, user) => {
            const type = getValueViaPath(
              externalData,
              'identity.data.type',
            ) as string
            return type === 'company'
          },
        }),
        buildTextField({
          id: 'companyInformation.nameOfBranch',
          title: information.labels.company.nameOfBranch,
          backgroundColor: 'blue',
          width: 'half',
          defaultValue: (application: Application) => '',
          condition: (formValue: FormValue, externalData, user) => {
            const type = getValueViaPath(
              externalData,
              'identity.data.type',
            ) as string
            return type === 'company'
          },
        }),
        buildTextField({
          id: 'companyInformation.addressOfBranch',
          title: information.labels.company.addressOfBranch,
          backgroundColor: 'blue',
          width: 'half',
          doesNotRequireAnswer: true,
          defaultValue: (application: Application) => '',
          condition: (formValue: FormValue, externalData, user) => {
            const type = getValueViaPath(
              externalData,
              'identity.data.type',
            ) as string
            return type === 'company'
          },
        }),
        buildSelectField({
          id: 'companyInformation.postnumberOfBranch',
          title: information.labels.company.postNumberAndTown,
          width: 'half',
          doesNotRequireAnswer: true,
          condition: (formValue: FormValue, externalData, user) => {
            const type = getValueViaPath(
              externalData,
              'identity.data.type',
            ) as string
            return type === 'company'
          },
          options: (application) => {
            const postCodes = getValueViaPath(
              application.externalData,
              'aoshData.data.postCode',
              [],
            ) as PostCodeDto[]

            return postCodes
              .filter((postCode) => postCode?.code && postCode?.name)
              .map(({ code, name }) => ({
                label: `${code} - ${name}`,
                value: code || '',
              }))
          },
        }),
      ],
    }),
  ],
})
