import {
  IndividualDto,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { AuditService } from '@island.is/nest/audit'
import { Inject, Logger } from '@nestjs/common'
import { isDefined } from '@island.is/shared/utils'
import { PersonalRepresentativeDTO } from '../personal-representative/dto/personal-representative.dto'
import { PersonalRepresentativeService } from '../personal-representative/services/personalRepresentative.service'
import { DelegationDTO } from './dto/delegation.dto'
import { partitionWithIndex } from './utils/partitionWithIndex'
import { ApiScopeInfo } from './delegations-incoming.service'
import {
  AuthDelegationProvider,
  AuthDelegationType,
} from '@island.is/shared/types'

export const UNKNOWN_NAME = 'Óþekkt nafn'

type FindAllIncomingOptions = {
  nationalId: string
  clientAllowedApiScopes?: ApiScopeInfo[]
  requireApiScopes?: boolean
}

export class DelegationsIncomingRepresentativeService {
  constructor(
    private prService: PersonalRepresentativeService,
    private nationalRegistryClient: NationalRegistryClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private auditService: AuditService,
  ) {}

  async findAllIncoming(
    {
      nationalId,
      clientAllowedApiScopes,
      requireApiScopes,
    }: FindAllIncomingOptions,
    useMaster = false,
  ): Promise<DelegationDTO[]> {
    if (
      requireApiScopes &&
      clientAllowedApiScopes &&
      !clientAllowedApiScopes.some(
        (s) => s.grantToPersonalRepresentatives && !s.isAccessControlled,
      )
    ) {
      return []
    }

    try {
      const toDelegationDTO = (
        name: string,
        representative: PersonalRepresentativeDTO,
      ): DelegationDTO => ({
        toNationalId: representative.nationalIdPersonalRepresentative,
        fromNationalId: representative.nationalIdRepresentedPerson,
        fromName: name,
        type: AuthDelegationType.PersonalRepresentative,
        provider: AuthDelegationProvider.PersonalRepresentativeRegistry,
        rights: representative.rights,
        prDelegationType: representative.prDelegationTypes,
      })

      const personalRepresentatives =
        await this.prService.getByPersonalRepresentative(
          {
            nationalIdPersonalRepresentative: nationalId,
          },
          useMaster,
        )
      // Filter if personal representative actually has a scope in client allowed scopes
      personalRepresentatives.filter((pr) => {
        if (pr.prDelegationTypes) {
          return pr.prDelegationTypes.some((type) =>
            clientAllowedApiScopes?.some(
              (scope) =>
                scope.grantToPersonalRepresentatives &&
                scope.name === type.name &&
                !scope.isAccessControlled,
            ),
          )
        }
      })

      const personPromises = personalRepresentatives.map(
        ({ nationalIdRepresentedPerson }) =>
          this.nationalRegistryClient
            .getIndividual(nationalIdRepresentedPerson)
            .catch(this.handlerGetIndividualError),
      )

      const persons = await Promise.all(personPromises)
      const personsValues = persons.filter((person) => person !== undefined)
      const personsValuesNoError = personsValues.filter(this.isNotError)

      // Divide personal representatives into alive or deceased.
      const [alive, deceased] = partitionWithIndex(
        personalRepresentatives,
        ({ nationalIdRepresentedPerson }, index) =>
          // Pass through although Þjóðskrá API throws an error since it is not required to view the personal representative.
          persons[index] instanceof Error ||
          // Make sure we can match the person to the personal representatives, i.e. not deceased
          (persons[index] as IndividualDto)?.nationalId ===
            nationalIdRepresentedPerson,
      )

      if (deceased.length > 0) {
        await this.makePersonalRepresentativesInactive(deceased)
      }

      return alive
        .map((pr) => {
          const person = this.getPersonByNationalId(
            personsValuesNoError,
            pr.nationalIdRepresentedPerson,
          )

          return toDelegationDTO(person?.name ?? UNKNOWN_NAME, pr)
        })
        .filter(isDefined)
    } catch (error) {
      this.logger.error('Error in findAllRepresentedPersons', error)
    }

    return []
  }

  private async makePersonalRepresentativesInactive(
    personalRepresentatives: PersonalRepresentativeDTO[],
  ) {
    // Delete all personal representatives and their rights
    const inactivePromises = personalRepresentatives
      .map(({ id }) => (id ? this.prService.makeInactive(id) : undefined))
      .filter(isDefined)

    await Promise.all(inactivePromises)

    this.auditService.audit({
      action: 'makePersonalRepresentativesInactiveForMissingPeople',
      resources: personalRepresentatives.map(({ id }) => id).filter(isDefined),
      system: true,
    })
  }

  private handlerGetIndividualError(error: null | Error) {
    return error
  }

  /**
   * Finds person by nationalId.
   */
  private getPersonByNationalId(
    persons: Array<IndividualDto | null>,
    nationalId: string,
  ) {
    return persons.find((person) => person?.nationalId === nationalId)
  }

  /**
   * Checks if item is not an instance of Error
   */
  private isNotError<T>(item: T | Error): item is T {
    return item instanceof Error === false
  }
}
