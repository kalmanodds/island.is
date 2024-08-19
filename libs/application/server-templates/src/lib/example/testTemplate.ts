import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildStaticTableField,
  buildSubmitField,
  buildTableRepeaterField,
  coreMessages,
} from '@island.is/application/core'
import { Form, FormModes, YES } from '@island.is/application/types'

import * as m from './messages'
import { format as formatNationalId } from 'kennitala'
import { GrindavikHousingBuyout } from './dataSchema'
import {
  calculateBuyoutPrice,
  calculateTotalLoanFromAnswers,
  getFireInsuranceValue,
  getPropertyAddress,
  getPropertyOwners,
} from './utils'
import {
  formatCurrency,
  formatPhoneNumber,
  removeCountryCode,
} from './formatters'
import { applicantInformationMultiField } from './applicantInformationMultiField'
import { applicantInformation as applicantInformationMessages } from './applicantInformationMultiField/messages'

const loanProviders = [
  'Arion banki',
  'HMS',
  'Íbúðalánasjóður',
  'Íslandsbanki',
  'Landsbankinn',
]

export const GrindavikHousingBuyoutForm: Form = buildForm({
  id: 'GrindavikHousingBuyoutDraft',
  title: m.application.general.name,

  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'applicantInfoSection',
      title: m.application.applicant.sectionTitle,
      children: [applicantInformationMultiField()],
    }),
    buildSection({
      id: 'propertyInformationSection',
      title: m.application.propertyInformation.sectionTitle,
      children: [
        buildMultiField({
          id: 'propertyInformationMultiField',
          title: m.application.propertyInformation.sectionTitle,
          description: m.application.propertyInformation.sectionDescription,
          children: [
            buildStaticTableField({
              title: ({ externalData }) => getPropertyAddress(externalData),
              header: [
                m.application.propertyInformation.propertyOwners,
                m.application.propertyInformation.ownerNationalId,
                m.application.propertyInformation.propertyPermit,
                m.application.propertyInformation.ownershipRatio,
              ],
              rows: ({ externalData }) => {
                const owners = getPropertyOwners(externalData)
                return owners.map((owner) => [
                  owner.nafn ?? '',
                  formatNationalId(owner.kennitala ?? ''),
                  owner.heimildBirting ?? '',
                  `${(owner.eignarhlutfall ?? 0) * 100}%`,
                ])
              },
              summary: ({ externalData }) => {
                const fireInsuranceValue = getFireInsuranceValue(externalData)
                return [
                  {
                    label: m.application.propertyInformation.fireInsuranceValue,
                    value: formatCurrency(fireInsuranceValue.toString()),
                  },
                ]
              },
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'additionalOwnersSection',
      title: m.application.additionalOwners.sectionTitle,
      condition: (_, externalData) => {
        const owners = getPropertyOwners(externalData)
        return owners.length > 1
      },
      children: [
        buildMultiField({
          id: 'additionalOwnersMultiField',
          title: m.application.additionalOwners.sectionTitle,
          description: m.application.additionalOwners.sectionDescription,
          children: [
            buildCustomField({
              id: 'additionalOwners',
              title: '',
              component: 'AdditionalOwnersRepeater',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'loanStatusSection',
      title: m.application.loanStatus.sectionTitle,
      children: [
        buildMultiField({
          id: 'loanStatusMultiField',
          title: m.application.loanStatus.sectionTitle,
          description: m.application.loanStatus.addLoanDescription,
          children: [
            buildTableRepeaterField({
              id: 'loans',
              marginTop: 2,
              title: '',
              addItemButtonText: m.application.loanStatus.addNewLoan,
              saveItemButtonText: m.application.loanStatus.saveNewLoan,
              fields: {
                provider: {
                  component: 'select',
                  label: m.application.loanStatus.loanProvider,
                  options: loanProviders.map((bank) => ({
                    value: bank,
                    label: bank,
                  })),
                },
                status: {
                  component: 'input',
                  label: m.application.loanStatus.statusOfLoan,
                  currency: true,
                },
              },
              table: {
                format: {
                  status: (v) => formatCurrency(v),
                },
              },
            }),
            buildDescriptionField({
              id: 'loanStatusAdditionalInfo',
              title: '',
              marginTop: [4, 6],
              description: m.application.loanStatus.additionalInfo,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'results',
      title: m.application.results.sectionTitle,
      children: [
        buildMultiField({
          id: 'resultsMultiField',
          title: m.application.results.sectionTitle,
          space: 3,
          children: [
            buildDescriptionField({
              id: '',
              title: '',
              description: m.application.results.explaination,
            }),
            buildStaticTableField({
              title: '',
              header: [
                m.application.results.tableDescription,
                m.application.results.tableValue,
              ],
              rows: (application) => {
                const { fireInsuranceValue, buyoutPrice, totalLoans } =
                  calculateBuyoutPrice(application)
                return [
                  [
                    m.application.results.fireAssessment,
                    formatCurrency(fireInsuranceValue.toString()),
                  ],
                  [
                    m.application.results.buyoutPrice,
                    formatCurrency(buyoutPrice.toString()),
                  ],
                  [
                    m.application.results.totalLoan,
                    formatCurrency((-totalLoans).toString()),
                  ],
                ]
              },
              summary: (application) => {
                const { result, closingPayment, buyoutPriceWithLoans } =
                  calculateBuyoutPrice(application)
                return [
                  {
                    label: m.application.results.payment,
                    value: formatCurrency(result.toString()),
                  },
                  {
                    label: m.application.results.closingPayment,
                    value: formatCurrency(closingPayment.toString()),
                  },
                  {
                    label: m.application.results.total,
                    value: formatCurrency(buyoutPriceWithLoans.toString()),
                  },
                ]
              },
            }),
            buildDescriptionField({
              id: 'infoText',
              title: '',
              description: m.application.results.infoText,
            }),
            buildCheckboxField({
              id: 'confirmLoanTakeover',
              title: '',
              defaultValue: [],
              options: [
                {
                  label: m.application.results.confirmLoanTakeover,
                  value: YES,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'sellerStatement',
      title: m.application.sellerStatement.sectionTitle,
      children: [
        buildMultiField({
          id: 'sellerStatementMultiField',
          title: m.application.sellerStatement.sectionTitle,
          description: m.application.sellerStatement.text,
          children: [
            buildCheckboxField({
              id: 'preemptiveRightWish',
              title: '',
              defaultValue: [],
              options: [
                {
                  label: m.application.sellerStatement.confirmationLabel,
                  value: YES,
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'overview',
      title: m.application.overview.sectionTitle,
      children: [
        buildMultiField({
          id: 'overviewMultiField',
          title: m.application.overview.sectionTitle,
          description: m.application.overview.sectionDescription,
          space: 3,
          children: [
            buildDividerField({}),

            // Applicant
            buildDescriptionField({
              id: 'applicantOverview',
              title: m.application.overview.applicantTitle,
              titleVariant: 'h3',
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.name,
              colSpan: '6/12',
              value: ({ answers }) =>
                (answers as GrindavikHousingBuyout).applicant.name,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.nationalId,
              colSpan: '6/12',
              value: ({ answers }) =>
                formatNationalId(
                  (answers as GrindavikHousingBuyout).applicant.nationalId,
                ),
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.email,
              colSpan: '6/12',
              value: ({ answers }) =>
                (answers as GrindavikHousingBuyout).applicant.email,
            }),
            buildKeyValueField({
              label: applicantInformationMessages.labels.tel,
              colSpan: '6/12',
              condition: (answers) =>
                !!(answers as GrindavikHousingBuyout)?.applicant?.phoneNumber,
              value: ({ answers }) =>
                formatPhoneNumber(
                  removeCountryCode(
                    (answers as GrindavikHousingBuyout).applicant.phoneNumber,
                  ),
                ),
            }),
            buildDividerField({}),

            // Additional owners
            buildCustomField({
              id: 'additionalOwnersOverview',
              title: m.application.additionalOwners.sectionTitle,
              component: 'AdditionalOwnersOverview',
            }),

            // Property
            buildDescriptionField({
              id: 'propertyOverview',
              title: m.application.overview.propertyTitle,
              titleVariant: 'h3',
            }),
            buildKeyValueField({
              label: '',
              value: ({ externalData }) => getPropertyAddress(externalData),
            }),
            buildKeyValueField({
              label: m.application.overview.compensationAssessmentTitle,
              colSpan: ['1/1', '6/12'],
              value: ({ externalData }) => {
                const fireInsuranceValue = getFireInsuranceValue(externalData)
                return formatCurrency(fireInsuranceValue.toString())
              },
            }),
            buildKeyValueField({
              label: m.application.overview.buyoutPriceTitle,
              colSpan: ['1/1', '6/12'],
              value: (application) => {
                const { buyoutPrice } = calculateBuyoutPrice(application)
                return formatCurrency(buyoutPrice.toString())
              },
            }),
            buildKeyValueField({
              label: m.application.overview.totalLoanTitle,
              colSpan: ['1/1', '6/12'],
              value: ({ answers }) => {
                const total = calculateTotalLoanFromAnswers(answers)
                return formatCurrency(total.toString())
              },
            }),
            buildDividerField({}),

            // Calculation
            buildDescriptionField({
              id: 'resultOverview',
              title: m.application.overview.resultTitle,
              titleVariant: 'h3',
            }),
            buildKeyValueField({
              label: m.application.results.payment,
              colSpan: ['1/1', '6/12'],
              value: (application) => {
                const { result } = calculateBuyoutPrice(application)
                return formatCurrency(result.toString())
              },
            }),
            buildKeyValueField({
              label: m.application.results.total,
              colSpan: ['1/1', '6/12'],
              value: (application) => {
                const { buyoutPriceWithLoans } =
                  calculateBuyoutPrice(application)
                return formatCurrency(buyoutPriceWithLoans.toString())
              },
            }),
            buildKeyValueField({
              label: m.application.results.confirmLoanTakeover,
              colSpan: ['1/1', '6/12'],
              value: ({ answers }) => {
                return (
                  answers as GrindavikHousingBuyout
                ).confirmLoanTakeover?.includes(YES)
                  ? coreMessages.radioYes
                  : coreMessages.radioNo
              },
            }),
            buildDividerField({}),

            // Seller statement
            buildDescriptionField({
              id: 'sellerStatementOverview',
              title: m.application.sellerStatement.sectionTitle,
              titleVariant: 'h3',
            }),
            buildKeyValueField({
              label: m.application.sellerStatement.confirmationLabel,
              colSpan: '1/1',
              value: ({ answers }) => {
                return (
                  answers as GrindavikHousingBuyout
                ).preemptiveRightWish?.includes(YES)
                  ? coreMessages.radioYes
                  : coreMessages.radioNo
              },
            }),

            buildCheckboxField({
              id: 'userConfirmation',
              title: '',
              defaultValue: [],
              options: [
                { label: m.application.overview.checkboxText, value: YES },
              ],
            }),

            buildSubmitField({
              id: 'submit',
              title: m.application.general.submit,
              placement: 'footer',
              actions: [
                {
                  event: 'SUBMIT',
                  name: m.application.general.submit,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
