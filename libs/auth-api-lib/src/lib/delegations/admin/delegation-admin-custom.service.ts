import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import kennitala from 'kennitala'
import { uuid } from 'uuidv4'

import { AuthDelegationType } from '@island.is/shared/types'
import { Auth, User } from '@island.is/auth-nest-tools'
import { NoContentException } from '@island.is/nest/problem'
import {
  Ticket,
  TicketStatus,
  ZendeskService,
} from '@island.is/clients/zendesk'

import { Delegation } from '../models/delegation.model'
import { DelegationAdminCustomDto } from '../dto/delegation-admin-custom.dto'
import { DelegationScope } from '../models/delegation-scope.model'
import { ApiScope } from '../../resources/models/api-scope.model'
import { ApiScopeDelegationType } from '../../resources/models/api-scope-delegation-type.model'
import { DelegationResourcesService } from '../../resources/delegation-resources.service'
import { DelegationsIndexService } from '../delegations-index.service'
import { DelegationScopeService } from '../delegation-scope.service'
import { CreatePaperDelegationDto } from '../dto/create-paper-delegation.dto'
import { DelegationDTO } from '../dto/delegation.dto'
import { NamesService } from '../names.service'
import { DELEGATION_TAG, ZENDESK_CUSTOM_FIELDS } from '../constants/zendesk'
import { DelegationDelegationType } from '../models/delegation-delegation-type.model'
import { DelegationsIncomingCustomService } from '../delegations-incoming-custom.service'
import { DelegationValidity } from '../types/delegationValidity'
import {
  DOMAIN_NAME_EN,
  DOMAIN_NAME_IS,
  NEW_DELEGATION_FROM_TEMPLATE_ID,
  NEW_DELEGATION_TEMPLATE_ID,
} from '../constants/hnipp'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { NotificationsApi } from '../../user-notification'
import { Features } from '@island.is/feature-flags'
import { FeatureFlagService } from '@island.is/nest/feature-flags'
import { ErrorCodes } from '@island.is/shared/utils'

@Injectable()
export class DelegationAdminCustomService {
  constructor(
    @InjectModel(Delegation)
    private delegationModel: typeof Delegation,
    @InjectModel(DelegationDelegationType)
    private delegationDelegationTypeModel: typeof DelegationDelegationType,
    private readonly zendeskService: ZendeskService,
    private delegationResourceService: DelegationResourcesService,
    private delegationsIncomingCustomService: DelegationsIncomingCustomService,
    private delegationIndexService: DelegationsIndexService,
    private delegationScopeService: DelegationScopeService,
    private notificationsApi: NotificationsApi,
    private namesService: NamesService,
    private featureFlagService: FeatureFlagService,
    private sequelize: Sequelize,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  private async notifyDelegationCreated({
    user,
    delegation,
    fromName,
    toName,
  }: {
    user: User
    delegation: Delegation
    fromName: string
    toName: string
  }) {
    const allowDelegationNotification = await this.featureFlagService.getValue(
      Features.isDelegationNotificationEnabled,
      false,
      user,
    )

    if (!allowDelegationNotification) {
      return
    }

    try {
      // Notify toNationalId of new delegation
      await this.notificationsApi.notificationsControllerCreateHnippNotification(
        {
          createHnippNotificationDto: {
            args: [
              { key: 'name', value: fromName },
              {
                key: 'domainNameIs',
                value: DOMAIN_NAME_IS,
              },
              {
                key: 'domainNameEn',
                value: DOMAIN_NAME_EN,
              },
            ],
            recipient: delegation.toNationalId,
            templateId: NEW_DELEGATION_TEMPLATE_ID,
          },
        },
      )
    } catch (e) {
      this.logger.error(
        `Failed to send delegation notification to delegation representative`,
        { error: e.message },
      )
    }

    try {
      // Notify fromNationalId of new delegation
      await this.notificationsApi.notificationsControllerCreateHnippNotification(
        {
          createHnippNotificationDto: {
            args: [{ key: 'name', value: toName }],
            recipient: delegation.fromNationalId,
            templateId: NEW_DELEGATION_FROM_TEMPLATE_ID,
          },
        },
      )
    } catch (e) {
      this.logger.error(
        `Failed to send delegation notification to delegation provider`,
        { error: e.message },
      )
    }
  }

  private getNationalIdsFromZendeskTicket(ticket: Ticket): {
    fromReferenceId: string
    toReferenceId: string
  } {
    const fromReferenceId = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.DelegationFromReferenceId,
    )
    const toReferenceId = ticket.custom_fields.find(
      (field) => field.id === ZENDESK_CUSTOM_FIELDS.DelegationToReferenceId,
    )

    if (!fromReferenceId || !toReferenceId) {
      throw new BadRequestException({
        message: 'Zendesk ticket is missing required custom fields',
        error: ErrorCodes.ZENDESK_CUSTOM_FIELDS_MISSING,
      })
    }

    return {
      fromReferenceId: fromReferenceId.value,
      toReferenceId: toReferenceId.value,
    }
  }

  async getAllDelegationsByNationalId(
    nationalId: string,
  ): Promise<DelegationAdminCustomDto> {
    const [
      incomingCustomDelegations,
      incomingGeneralDelegations,
      outgoingCustomDelegations,
      outgoingGeneralDelegations,
    ] = await Promise.all([
      this.delegationsIncomingCustomService.findAllValidIncoming({
        nationalId: nationalId,
        validity: DelegationValidity.ALL,
      }),
      this.delegationsIncomingCustomService.findAllValidGeneralMandate({
        nationalId: nationalId,
      }),
      this.delegationModel.findAll({
        where: {
          fromNationalId: nationalId,
        },
        include: [
          {
            model: DelegationScope,
            required: true,
            include: [
              {
                model: ApiScope,
                required: true,
                as: 'apiScope',
                where: {
                  enabled: true,
                },
                include: [
                  {
                    model: ApiScopeDelegationType,
                    required: true,
                    where: {
                      delegationType: AuthDelegationType.Custom,
                    },
                  },
                ],
              },
            ],
          },
        ],
      }),
      this.delegationModel.findAll({
        where: {
          fromNationalId: nationalId,
        },
        include: [
          {
            model: DelegationDelegationType,
            required: true,
            where: {
              delegationTypeId: AuthDelegationType.GeneralMandate,
            },
          },
        ],
      }),
    ])

    return {
      incoming: [...incomingCustomDelegations, ...incomingGeneralDelegations],
      outgoing: [
        ...outgoingGeneralDelegations.map((d) =>
          d.toDTO(AuthDelegationType.GeneralMandate),
        ),
        ...outgoingCustomDelegations.map((delegation) => delegation.toDTO()),
      ],
    }
  }

  async createDelegation(
    user: User,
    delegation: CreatePaperDelegationDto,
  ): Promise<DelegationDTO> {
    this.validatePersonsNationalIds(
      delegation.toNationalId,
      delegation.fromNationalId,
    )

    const zendeskCase = await this.zendeskService.getTicket(
      delegation.referenceId,
    )

    if (!zendeskCase.tags.includes(DELEGATION_TAG)) {
      throw new BadRequestException({
        message: 'Zendesk case is missing required tag',
        error: ErrorCodes.ZENDESK_TAG_MISSING,
      })
    }

    if (zendeskCase.status !== TicketStatus.Solved) {
      throw new BadRequestException({
        message: 'Zendesk case is not solved',
        error: ErrorCodes.ZENDESK_STATUS,
      })
    }

    const { fromReferenceId, toReferenceId } =
      this.getNationalIdsFromZendeskTicket(zendeskCase)

    if (
      fromReferenceId !== delegation.fromNationalId ||
      toReferenceId !== delegation.toNationalId
    ) {
      throw new BadRequestException({
        message: 'National Ids do not match the Zendesk ticket',
        error: ErrorCodes.ZENDESK_NATIONAL_IDS_MISMATCH,
      })
    }

    const [fromDisplayName, toName] = await Promise.all([
      this.namesService.getPersonName(delegation.fromNationalId),
      this.namesService.getPersonName(delegation.toNationalId),
    ])

    const newDelegation = await this.delegationModel.create(
      {
        id: uuid(),
        toNationalId: delegation.toNationalId,
        fromNationalId: delegation.fromNationalId,
        createdByNationalId: user.actor?.nationalId ?? user.nationalId,
        referenceId: delegation.referenceId,
        toName,
        fromDisplayName,
        delegationDelegationTypes: [
          {
            delegationTypeId: AuthDelegationType.GeneralMandate,
            validTo: delegation.validTo,
          },
        ] as DelegationDelegationType[],
      },
      {
        include: [this.delegationDelegationTypeModel],
      },
    )

    // Index delegations for the toNationalId
    void this.indexDelegations(delegation.toNationalId, user)

    void this.notifyDelegationCreated({
      user,
      delegation: newDelegation,
      fromName: fromDisplayName,
      toName,
    })

    return newDelegation.toDTO(AuthDelegationType.GeneralMandate)
  }

  async deleteDelegation(user: User, delegationId: string): Promise<void> {
    const delegation = await this.delegationModel.findByPk(delegationId)

    if (!delegation || !delegation.referenceId) {
      throw new NoContentException()
    }

    if (!delegation.referenceId) {
      throw new NoContentException()
    }

    const userScopes = await this.delegationResourceService.findScopes(
      user,
      delegation.domainName ?? null,
    )

    await this.sequelize.transaction(async (transaction) => {
      await this.delegationScopeService.delete(
        delegationId,
        userScopes.map((scope) => scope.name),
        transaction,
      )

      // If no scopes are left delete the delegation.
      const remainingScopes = await this.delegationScopeService.findAll(
        delegationId,
      )

      if (remainingScopes.length === 0) {
        await this.delegationModel.destroy({
          transaction,
          where: {
            id: delegationId,
          },
        })
      }

      // Index delegations for the toNationalId
      void this.indexDelegations(delegation.toNationalId, user)
    })
  }

  private validatePersonsNationalIds(
    toNationalId: string,
    fromNationalId: string,
  ) {
    if (toNationalId === fromNationalId) {
      throw new BadRequestException({
        message: 'National Ids cannot be the same',
        error: ErrorCodes.INPUT_VALIDATION_SAME_NATIONAL_ID,
      })
    }

    if (
      !(kennitala.isPerson(fromNationalId) && kennitala.isPerson(toNationalId))
    ) {
      throw new BadRequestException({
        message: 'National Ids are not valid',
        error: ErrorCodes.INPUT_VALIDATION_INVALID_PERSON,
      })
    }
  }

  private indexDelegations(nationalId: string, auth: Auth) {
    void this.delegationIndexService.indexCustomDelegations(nationalId, auth)
    void this.delegationIndexService.indexGeneralMandateDelegations(
      nationalId,
      auth,
    )
  }
}
