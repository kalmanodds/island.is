import {
  buildCustomField,
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  coreMessages,
  buildTextField,
  buildSubSection,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'
import Logo from '../assets/Logo'
import {
  employerFormMessages,
  otherParentApprovalFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getLastDayOfLastMonth,
} from '../lib/parentalLeaveUtils'
import { getSelectOptionLabel } from '../lib/parentalLeaveClientUtils'

export const EmployerApproval: Form = buildForm({
  id: 'EmployerApprovalForParentalLeave',
  title: employerFormMessages.formTitle,
  logo: Logo,
  mode: FormModes.IN_PROGRESS,
  children: [
    buildSection({
      id: 'review',
      title: employerFormMessages.reviewSection,
      children: [
        buildSubSection({
          id: 'review.companyNationalRegistryId',
          title: employerFormMessages.employerNationalRegistryIdSection,
          children: [
            buildTextField({
              id: 'employerNationalRegistryId',
              title: employerFormMessages.employerNationalRegistryId,
              description: (application) => ({
                ...employerFormMessages.employerNationalRegistryIdDescription,
                values: { nationalId: application.applicant },
              }),
              format: '######-####',
              placeholder: '000000-0000',
            }),
          ],
        }),
        buildSubSection({
          id: 'review.confirmation',
          title: employerFormMessages.confirmationSubSection,
          children: [
            buildMultiField({
              id: 'multi',
              title: employerFormMessages.reviewMultiTitle,
              children: [
                buildCustomField(
                  {
                    id: 'timeline',
                    title: employerFormMessages.reviewMultiTitle,
                    component: 'PeriodsRepeater',
                  },
                  {
                    editable: false,
                    showDescription: false,
                  },
                ),
                buildDescriptionField({
                  id: 'pension',
                  title:
                    parentalLeaveFormMessages.shared.salaryLabelPensionFund,
                  titleVariant: 'h4',
                  width: 'half',
                  description: (application: Application) => {
                    const { pensionFund } = getApplicationAnswers(
                      application.answers,
                    )
                    const { pensionFunds } = getApplicationExternalData(
                      application.externalData,
                    )

                    return {
                      ...parentalLeaveFormMessages.shared.pensionFundValue,
                      values: {
                        pensionFundValue:
                          pensionFund !== 'L000'
                            ? getSelectOptionLabel(pensionFunds, pensionFund)
                            : '—',
                      },
                    }
                  },
                }),
                buildDescriptionField({
                  id: 'union',
                  title: parentalLeaveFormMessages.shared.salaryLabelUnion,
                  titleVariant: 'h4',
                  width: 'half',
                  description: (application: Application) => {
                    const { union } = getApplicationAnswers(application.answers)
                    const { unions } = getApplicationExternalData(
                      application.externalData,
                    )

                    return {
                      ...parentalLeaveFormMessages.shared.unionValue,
                      values: {
                        unionValue:
                          union !== 'F000'
                            ? getSelectOptionLabel(unions, union)
                            : '—',
                      },
                    }
                  },
                }),
                buildDescriptionField({
                  id: 'final',
                  title: otherParentApprovalFormMessages.warning,
                  titleVariant: 'h4',
                  description:
                    otherParentApprovalFormMessages.startDateInThePast,
                  condition: (answers) => {
                    const lastDateOfLastMonth = getLastDayOfLastMonth()
                    const startDateTime = new Date(
                      getApplicationAnswers(answers).periods[0].startDate,
                    ).getTime()

                    return startDateTime < lastDateOfLastMonth.getTime()
                  },
                }),

                // from Employers Approve Edits
                // buildDescriptionField({
                //   id: 'final',
                //   title: otherParentApprovalFormMessages.warning,
                //   titleVariant: 'h4',
                //   description:
                //     otherParentApprovalFormMessages.startDateInThePast,

                //   // TODO: enable this when we could get 'applicationFundId' from externalData

                //   // condition: (answers, externalData) => {
                //   //   const { applicationFundId } = getApplicationExternalData(
                //   //     externalData,
                //   //   )
                //   //   if (!applicationFundId || applicationFundId === '') {
                //   //     const { periods } = getApplicationAnswers(answers)
                //   //     return (
                //   //       periods.length > 0 &&
                //   //       new Date(periods[0].startDate).getTime() >=
                //   //         currentDateStartTime()
                //   //     )
                //   //   }

                //   //   return true
                //   // },
                // }),

                buildSubmitField({
                  id: 'submit',
                  title: coreMessages.buttonSubmit,
                  placement: 'footer',
                  actions: [
                    {
                      name: employerFormMessages.buttonReject,
                      type: 'subtle',
                      event: DefaultEvents.REJECT,
                    },
                    {
                      name: coreMessages.buttonApprove,
                      type: 'primary',
                      event: DefaultEvents.APPROVE,
                      // TODO: enable this when we could get 'applicationFundId' from externalData
                      // condition: (answers) =>
                      //   new Date(
                      //     getApplicationAnswers(answers).periods[0].startDate,
                      //   ).getTime() >= currentDateStartTime(),

                      // from Employers Approve Edits
                      // TODO: enable this when we could get 'applicationFundId' from externalData

                      // condition: (answers, externalData) => {
                      //   const {
                      //     applicationFundId,
                      //   } = getApplicationExternalData(externalData)
                      //   console.log('----------- Emloyer', applicationFundId)
                      //   if (!applicationFundId || applicationFundId === '') {
                      //     const { periods } = getApplicationAnswers(answers)
                      //     return (
                      //       periods.length > 0 &&
                      //       new Date(periods[0].startDate).getTime() >=
                      //         currentDateStartTime()
                      //     )
                      //   }

                      //   return true
                      // },
                    },
                  ],
                }),
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final.approve',
          title: coreMessages.thanks,
          description: coreMessages.thanksDescription,
        }),
      ],
    }),
  ],
})
