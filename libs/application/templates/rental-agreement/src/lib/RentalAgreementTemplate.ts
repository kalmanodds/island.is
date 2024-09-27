import {
  ApplicationTemplate,
  ApplicationTypes,
  ApplicationContext,
  ApplicationStateSchema,
  DefaultEvents,
} from '@island.is/application/types'
import { ApplicationStates, Roles, DAY } from './constants'
import { Features } from '@island.is/feature-flags'
import { dataSchema } from './dataSchema'

type Events = { type: DefaultEvents.SUBMIT } | { type: DefaultEvents.EDIT }

const RentalAgreementTemplate: ApplicationTemplate<
  ApplicationContext,
  ApplicationStateSchema<Events>,
  Events
> = {
  type: ApplicationTypes.RENTAL_AGREEMENT,
  name: 'Leigusamningur',
  institution: 'Húsnæðis- og mannvirkjastofnun',
  dataSchema,
  featureFlag: Features.rentalAgreement,
  stateMachineConfig: {
    initial: ApplicationStates.PREREQUISITES,
    states: {
      [ApplicationStates.PREREQUISITES]: {
        meta: {
          name: 'Leigusamningur',
          status: 'draft',
          lifecycle: {
            shouldBeListed: false,
            shouldBePruned: true,
            whenToPrune: DAY,
          },
          roles: [
            {
              id: Roles.APPLICANT,
              formLoader: () =>
                import('../forms/form').then((module) =>
                  Promise.resolve(module.RentalAgreementForm),
                ),
              actions: [
                { event: 'SUBMIT', name: 'Staðfesta', type: 'primary' },
              ],
              write: 'all',
              read: 'all',
              delete: true,
            },
          ],
        },

        on: {
          [DefaultEvents.SUBMIT]: {
            target: 'draft',
          },
        },
      },
    },
  },
  mapUserToRole() {
    return Roles.APPLICANT
  },
}

export default RentalAgreementTemplate
