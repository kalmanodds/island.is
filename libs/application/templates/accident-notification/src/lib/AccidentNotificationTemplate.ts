import {
  coreHistoryMessages,
  corePendingActionMessages,
  DefaultStateLifeCycle,
  getValueViaPath,
} from '@island.is/application/core'
import {
  Application,
  ApplicationContext,
  ApplicationConfigurations,
  ApplicationRole,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  defineTemplateApi,
  PendingAction,
  FormModes,
} from '@island.is/application/types'
import set from 'lodash/set'
import { assign } from 'xstate'
import { AccidentTypeEnum, ReviewApprovalEnum } from '..'
import { States } from '../constants'
import { ApiActions } from '../shared'
import { WhoIsTheNotificationForEnum } from '../types'
import { AccidentNotificationSchema } from './dataSchema'
import { anPendingActionMessages, application } from './messages'
import { AuthDelegationType } from '@island.is/shared/types'
import { IdentityApi, NationalRegistryUserApi } from '../dataProviders'

// The applicant is the applicant of the application, can be someone in power of attorney or the representative for the company
// The assignee is the person who is assigned to review the application can be the injured person or the representative for the company
// The assignee should see all data related to the application being submitted to sjukra but not data only relevant to applicant
enum Roles {
  PROCURER = 'procurer',
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
}

type AccidentNotificationEvent =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.ASSIGN }

const assignStatePendingAction = (
  application: Application,
  role: string,
): PendingAction => {
  if (role === Roles.ASSIGNEE) {
    return {
      title: corePendingActionMessages.waitingForAssigneeTitle,
      content: corePendingActionMessages.waitingForAssigneeDescription,
      displayStatus: 'warning',
    }
  } else {
    return {
      title: corePendingActionMessages.waitingForAssigneeTitle,
      content:
        anPendingActionMessages.waitForReivewerAndAddAttachmentDescription,
      displayStatus: 'info',
    }
  }
}

const reviewStatePendingAction = (
  _application: Application,
  role: string,
): PendingAction => {
  if (role === Roles.ASSIGNEE) {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: corePendingActionMessages.waitingForAssigneeDescription,
      displayStatus: 'warning',
    }
  } else {
    return {
      title: corePendingActionMessages.waitingForReviewTitle,
      content: corePendingActionMessages.youNeedToReviewDescription,
      displayStatus: 'info',
    }
  }
}

const AccidentNotificationTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<AccidentNotificationEvent>,
  AccidentNotificationEvent
> = {
  type: ApplicationTypes.ACCIDENT_NOTIFICATION,
  name: application.general.name,
  institution: application.general.institutionName,
  translationNamespaces: [
    ApplicationConfigurations.AccidentNotification.translation,
  ],
  dataSchema: AccidentNotificationSchema,
  allowedDelegations: [
    {
      type: AuthDelegationType.ProcurationHolder,
    },
    {
      type: AuthDelegationType.Custom,
    },
  ],
  stateMachineConfig: {
    initial: States.PREQUISITES,
    states: {
      [States.PREQUISITES]: {
        meta: {
          name: application.general.name.defaultMessage,
          progress: 0,
          lifecycle: DefaultStateLifeCycle,
          status: FormModes.DRAFT,
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationStarted,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/PrerequsitesForm').then((val) =>
                  Promise.resolve(val.PrerequisitesForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              api: [NationalRegistryUserApi, IdentityApi],
              delete: true,
            },
            {
              id: Roles.PROCURER,
              formLoader: () =>
                import('../forms/PrerequsitesProcureForm').then((val) =>
                  Promise.resolve(val.PrerequisitesProcureForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              api: [NationalRegistryUserApi, IdentityApi],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.DRAFT,
          },
        },
      },
      [States.DRAFT]: {
        meta: {
          name: application.general.name.defaultMessage,
          progress: 0.4,
          lifecycle: DefaultStateLifeCycle,
          status: FormModes.DRAFT,
          actionCard: {
            historyLogs: [
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.applicationSent,
              },
            ],
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/AccidentNotificationForm/index').then((val) =>
                  Promise.resolve(val.AccidentNotificationForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              api: [NationalRegistryUserApi],
              delete: true,
            },
            {
              id: Roles.PROCURER,
              formLoader: () =>
                import('../forms/AccidentNotificationForm/index').then((val) =>
                  Promise.resolve(val.AccidentNotificationForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              api: [NationalRegistryUserApi],
              delete: true,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEW,
          },
        },
      },
      [States.REVIEW]: {
        entry: 'assignUser',
        meta: {
          name: States.REVIEW,
          progress: 0.8,
          status: 'inprogress',
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          actionCard: {
            pendingAction: assignStatePendingAction,
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: coreHistoryMessages.applicationApproved,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: coreHistoryMessages.applicationRejected,
              },
              {
                onEvent: DefaultEvents.ASSIGN,
                logMessage: coreHistoryMessages.applicationAssigned,
              },
            ],
          },
          onEntry: defineTemplateApi({
            action: ApiActions.submitApplication,
            shouldPersistToExternalData: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.ApplicantReview),
                ),
              read: 'all',
              write: 'all',
              actions: [
                { event: 'APPROVE', name: 'Samþykki', type: 'primary' },
              ],
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.AssigneeReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },

        on: {
          [DefaultEvents.ASSIGN]: {
            target: States.REVIEW,
          },
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEW_ADD_ATTACHMENT,
          },
          [DefaultEvents.REJECT]: {
            target: States.IN_FINAL_REVIEW,
            actions: 'rejectApplication',
          },
          [DefaultEvents.APPROVE]: {
            target: States.IN_FINAL_REVIEW,
            actions: 'approveApplication',
          },
        },
      },
      [States.REVIEW_ADD_ATTACHMENT]: {
        meta: {
          status: 'inprogress',
          name: States.REVIEW_ADD_ATTACHMENT,
          progress: 0.8,
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: false,
          },
          actionCard: {
            pendingAction: reviewStatePendingAction,
            historyLogs: [
              {
                onEvent: DefaultEvents.APPROVE,
                logMessage: coreHistoryMessages.applicationApproved,
              },
              {
                onEvent: DefaultEvents.REJECT,
                logMessage: coreHistoryMessages.applicationRejected,
              },
              {
                onEvent: DefaultEvents.SUBMIT,
                logMessage: coreHistoryMessages.attachmentsAdded,
              },
            ],
          },
          onEntry: defineTemplateApi({
            action: ApiActions.addAttachment,
            shouldPersistToExternalData: true,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.ApplicantReview),
                ),
              read: 'all',
              write: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.AssigneeReview),
                ),
              read: 'all',
              write: 'all',
            },
          ],
        },

        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEW_ADD_ATTACHMENT,
            actions: 'attachments',
          },
          [DefaultEvents.REJECT]: {
            target: States.IN_FINAL_REVIEW,
            actions: 'rejectApplication',
          },
          [DefaultEvents.APPROVE]: {
            target: States.IN_FINAL_REVIEW,
            actions: 'approveApplication',
          },
        },
      },
      // State when assignee has approved or reject the appliction
      [States.IN_FINAL_REVIEW]: {
        meta: {
          status: 'completed',
          name: States.IN_FINAL_REVIEW,
          progress: 1,
          lifecycle: DefaultStateLifeCycle,
          onEntry: defineTemplateApi({
            action: ApiActions.reviewApplication,
          }),
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.ApplicantReview),
                ),
              read: 'all',
            },
            {
              id: Roles.ASSIGNEE,
              formLoader: () =>
                import('../forms/InReviewForm/index').then((val) =>
                  Promise.resolve(val.AssigneeReview),
                ),
              read: 'all',
              write: 'all',
              shouldBeListedForRole: false,
            },
          ],
        },
        on: {
          [DefaultEvents.SUBMIT]: {
            target: States.REVIEW_ADD_ATTACHMENT,
          },
        },
      },
    },
  },
  stateMachineOptions: {
    actions: {
      attachments: assign((context) => {
        return context
      }),
      approveApplication: assign((context) => {
        const { application } = context
        const { answers } = application

        set(answers, 'reviewApproval', ReviewApprovalEnum.APPROVED)

        return context
      }),
      rejectApplication: assign((context) => {
        const { application } = context
        const { answers } = application

        set(answers, 'reviewApproval', ReviewApprovalEnum.REJECTED)

        return context
      }),
      assignUser: assign((context) => {
        const { application } = context

        const assigneeId = getNationalIdOfReviewer(application)
        if (assigneeId) {
          set(application, 'assignees', [assigneeId])
        }

        return context
      }),
    },
  },
  mapUserToRole(
    id: string,
    application: Application,
  ): ApplicationRole | undefined {
    const { applicant, applicantActors, assignees } = application

    if (id === applicant) {
      if (applicantActors.length) return Roles.PROCURER
      if (assignees.includes(id)) return Roles.ASSIGNEE
      return Roles.APPLICANT
    }

    if (assignees.includes(id)) return Roles.ASSIGNEE

    return undefined
  },
}

export default AccidentNotificationTemplate

const getNationalIdOfReviewer = (application: Application) => {
  try {
    const accidentType = getValueViaPath(
      application.answers,
      'accidentType',
    ) as AccidentTypeEnum
    const whoIsTheNotificationFor = getValueViaPath(
      application.answers,
      'whoIsTheNotificationFor.answer',
    )
    if (accidentType === AccidentTypeEnum.HOMEACTIVITIES) {
      return null
    }
    // In this case the Assignee in the review process is the injured Person
    if (
      whoIsTheNotificationFor === WhoIsTheNotificationForEnum.JURIDICALPERSON
    ) {
      return getValueViaPath(
        application.answers,
        'injuredPersonInformation.nationalId',
      )
    }

    // In Every other case the Representative is the Assignee in the review Process
    return getValueViaPath(application.answers, 'representative.nationalId')
  } catch (error) {
    console.log(error)
    return 0
  }
}
