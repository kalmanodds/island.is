import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { Op } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'
import { isEmail } from 'class-validator'
import addMonths from 'date-fns/addMonths'
import { Sequelize } from 'sequelize-typescript'
import * as kennitala from 'kennitala'
import { parsePhoneNumber } from 'libphonenumber-js'

import { isDefined } from '@island.is/shared/utils'
import { AttemptFailed } from '@island.is/nest/problem'
import type { User } from '@island.is/auth-nest-tools'

import { VerificationService } from '../user-profile/verification.service'
import { UserProfile } from '../user-profile/userProfile.model'
import { formatPhoneNumber } from '../utils/format-phone-number'
import { PatchUserProfileDto } from './dto/patch-user-profile.dto'
import { UserProfileDto } from './dto/user-profile.dto'
import { IslykillService } from './islykill.service'
import { DataStatus } from '../user-profile/types/dataStatusTypes'
import { NudgeType } from '../types/nudge-type'
import { PaginatedUserProfileDto } from './dto/paginated-user-profile.dto'

export const NUDGE_INTERVAL = 6
export const SKIP_INTERVAL = 1

@Injectable()
export class UserProfileService {
  constructor(
    @InjectModel(UserProfile)
    private readonly userProfileModel: typeof UserProfile,
    @Inject(VerificationService)
    private readonly verificationService: VerificationService,
    private readonly islykillService: IslykillService,
    private sequelize: Sequelize,
  ) {}

  async findAllBySearchTerm(search: string): Promise<PaginatedUserProfileDto> {
    // Validate search term
    if (!this.isSearchTermValid(search)) {
      throw new BadRequestException('Invalid search term')
    }

    const userProfiles = await this.userProfileModel.findAll({
      where: {
        [Op.or]: [
          { nationalId: search },
          { email: search },
          { mobilePhoneNumber: search },
        ],
      },
    })

    const userProfileDtos = userProfiles.map((userProfile) => ({
      nationalId: userProfile.nationalId,
      email: userProfile.email,
      mobilePhoneNumber: userProfile.mobilePhoneNumber,
      locale: userProfile.locale,
      mobilePhoneNumberVerified: userProfile.mobilePhoneNumberVerified,
      emailVerified: userProfile.emailVerified,
      documentNotifications: userProfile.documentNotifications,
      emailNotifications: userProfile.emailNotifications,
    }))

    return {
      data: userProfileDtos,
      totalCount: userProfileDtos.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  async findById(
    nationalId: string,
    useMaster = false,
  ): Promise<UserProfileDto> {
    const userProfile = await this.userProfileModel.findOne({
      where: { nationalId },
      useMaster,
    })

    if (!userProfile) {
      return {
        nationalId,
        email: null,
        mobilePhoneNumber: null,
        locale: null,
        mobilePhoneNumberVerified: false,
        emailVerified: false,
        documentNotifications: true,
        needsNudge: null,
        emailNotifications: true,
      }
    }

    return {
      nationalId: userProfile.nationalId,
      email: userProfile.email,
      mobilePhoneNumber: userProfile.mobilePhoneNumber,
      locale: userProfile.locale,
      mobilePhoneNumberVerified: userProfile.mobilePhoneNumberVerified,
      emailVerified: userProfile.emailVerified,
      documentNotifications: userProfile.documentNotifications,
      needsNudge: this.checkNeedsNudge(userProfile),
      emailNotifications: userProfile.emailNotifications,
    }
  }

  async patch(
    user: User,
    userProfile: PatchUserProfileDto,
  ): Promise<UserProfileDto> {
    const { nationalId, audkenniSimNumber } = user
    const isEmailDefined = isDefined(userProfile.email)
    const isMobilePhoneNumberDefined = isDefined(userProfile.mobilePhoneNumber)

    const audkenniSimSameAsMobilePhoneNumber =
      this.checkAudkenniSameAsMobilePhoneNumber(
        audkenniSimNumber,
        userProfile.mobilePhoneNumber,
      )

    const shouldVerifyEmail = isEmailDefined && userProfile.email !== ''
    const shouldVerifyMobilePhoneNumber =
      !audkenniSimSameAsMobilePhoneNumber &&
      isMobilePhoneNumberDefined &&
      userProfile.mobilePhoneNumber !== ''

    if (shouldVerifyEmail && !isDefined(userProfile.emailVerificationCode)) {
      throw new BadRequestException('Email verification code is required')
    }

    if (
      shouldVerifyMobilePhoneNumber &&
      !isDefined(userProfile.mobilePhoneNumberVerificationCode)
    ) {
      throw new BadRequestException(
        'Mobile phone number verification code is required',
      )
    }

    await this.sequelize.transaction(async (transaction) => {
      const commonArgs = [nationalId, { transaction, maxTries: 3 }] as const

      if (shouldVerifyEmail) {
        const { confirmed, message, remainingAttempts } =
          await this.verificationService.confirmEmail(
            {
              email: userProfile.email,
              hash: userProfile.emailVerificationCode,
            },
            ...commonArgs,
          )

        if (!confirmed) {
          // Check if we should throw a BadRequest or an AttemptFailed error
          if (remainingAttempts >= 0) {
            throw new AttemptFailed(remainingAttempts, {
              emailVerificationCode: 'Verification code does not match.',
            })
          } else {
            throw new BadRequestException(message)
          }
        }
      }

      if (shouldVerifyMobilePhoneNumber) {
        const { confirmed, message, remainingAttempts } =
          await this.verificationService.confirmSms(
            {
              mobilePhoneNumber: userProfile.mobilePhoneNumber,
              code: userProfile.mobilePhoneNumberVerificationCode,
            },
            ...commonArgs,
          )

        if (confirmed === false) {
          // Check if we should throw a BadRequest or an AttemptFailed error
          if (remainingAttempts >= 0) {
            throw new AttemptFailed(remainingAttempts, {
              smsVerificationCode: 'Verification code does not match.',
            })
          } else if (remainingAttempts === -1) {
            throw new AttemptFailed(0)
          } else {
            throw new BadRequestException(message)
          }
        }
      }

      const formattedPhoneNumber = isMobilePhoneNumberDefined
        ? formatPhoneNumber(userProfile.mobilePhoneNumber)
        : undefined

      const currentUserProfile = await this.userProfileModel.findOne({
        where: { nationalId },
        transaction,
        useMaster: true,
      })

      const update = {
        nationalId,
        ...(isEmailDefined && {
          email: userProfile.email || null,
          emailVerified: userProfile.email !== '',
          emailStatus: userProfile.email
            ? DataStatus.VERIFIED
            : currentUserProfile.emailStatus === DataStatus.NOT_VERIFIED
            ? DataStatus.NOT_DEFINED
            : DataStatus.EMPTY,
        }),
        ...(isMobilePhoneNumberDefined && {
          mobilePhoneNumber: formattedPhoneNumber || null,
          mobilePhoneNumberVerified: formattedPhoneNumber !== '',
          mobileStatus: formattedPhoneNumber
            ? DataStatus.VERIFIED
            : currentUserProfile.mobileStatus === DataStatus.NOT_VERIFIED
            ? DataStatus.NOT_DEFINED
            : DataStatus.EMPTY,
        }),
        ...(isDefined(userProfile.locale) && {
          locale: userProfile.locale,
        }),
        ...(isDefined(userProfile.emailNotifications) && {
          emailNotifications: userProfile.emailNotifications,
        }),
        ...(isDefined(userProfile.documentNotifications) && {
          documentNotifications: userProfile.documentNotifications,
        }),
      }

      await this.userProfileModel.upsert(
        {
          ...update,
          lastNudge: new Date(),
          nextNudge: addMonths(
            new Date(),
            this.hasUnverifiedOrNotDefinedData({
              email: isEmailDefined ? update.email : currentUserProfile?.email,
              mobilePhoneNumber: isMobilePhoneNumberDefined
                ? update.mobilePhoneNumber
                : currentUserProfile?.mobilePhoneNumber,
              emailStatus:
                update.emailStatus ??
                (currentUserProfile?.emailStatus as DataStatus),
              mobileStatus:
                update.mobileStatus ??
                (currentUserProfile?.mobileStatus as DataStatus),
              emailVerified:
                update.emailVerified ?? currentUserProfile?.emailVerified,
              mobilePhoneNumberVerified:
                update.mobilePhoneNumberVerified ??
                currentUserProfile?.mobilePhoneNumberVerified,
            })
              ? SKIP_INTERVAL
              : NUDGE_INTERVAL,
          ),
        },
        { transaction },
      )

      if (
        isEmailDefined ||
        isMobilePhoneNumberDefined ||
        isDefined(userProfile.emailNotifications)
      ) {
        await this.islykillService.upsertIslykillSettings({
          nationalId,
          phoneNumber: formattedPhoneNumber,
          email: userProfile.email,
          canNudge: userProfile.emailNotifications,
        })
      }
    })

    return this.findById(nationalId, true)
  }

  async createEmailVerification({
    nationalId,
    email,
  }: {
    nationalId: string
    email: string
  }) {
    if (!isEmail(email)) {
      throw new BadRequestException('Email is invalid')
    }
    await this.verificationService.createEmailVerification(nationalId, email, 3)
  }

  async createSmsVerification({
    nationalId,
    mobilePhoneNumber,
  }: {
    nationalId: string
    mobilePhoneNumber: string
  }) {
    await this.verificationService.createSmsVerification(
      {
        nationalId,
        mobilePhoneNumber,
      },
      3,
    )
  }

  /**
   * Confirms the nudge for the user
   * Moves the next nudge date to 6 months from now if the user has skipped the overview
   * Moves the next nudge date to 1 month from now if the user has skipped the email or mobile phone number
   * Sets the email and mobile phone number status to empty if the user has skipped the overview, that means the user has seen the nudge and acknowledged that the data is empty
   * Sets the email and mobile phone number status to empty if the user has skipped the email or mobile phone number, that means the user has seen the nudge and acknowledged that the data is empty
   * @param nationalId
   * @param nudgeType
   */
  async confirmNudge(nationalId: string, nudgeType: NudgeType): Promise<void> {
    const date = new Date()

    const currentProfile = await this.userProfileModel.findOne({
      where: {
        nationalId,
      },
    })

    await this.userProfileModel.upsert({
      nationalId,
      lastNudge: date,
      nextNudge: addMonths(
        date,
        nudgeType === NudgeType.NUDGE ? NUDGE_INTERVAL : SKIP_INTERVAL,
      ),
      ...(currentProfile?.emailStatus === DataStatus.NOT_DEFINED &&
        nudgeType === NudgeType.NUDGE && {
          emailStatus: DataStatus.EMPTY,
        }),
      ...(currentProfile?.mobileStatus === DataStatus.NOT_DEFINED &&
        nudgeType === NudgeType.NUDGE && {
          mobileStatus: DataStatus.EMPTY,
        }),
    })
  }

  private checkNeedsNudge(userProfile: UserProfile): boolean | null {
    if (userProfile.nextNudge) {
      if (!userProfile.email && !userProfile.mobilePhoneNumber) {
        return userProfile.nextNudge < new Date()
      }

      if (
        (userProfile.email && userProfile.emailVerified) ||
        (userProfile.mobilePhoneNumber && userProfile.mobilePhoneNumberVerified)
      ) {
        return userProfile.nextNudge < new Date()
      }
    } else {
      if (
        (userProfile.email && userProfile.emailVerified) ||
        (userProfile.mobilePhoneNumber && userProfile.mobilePhoneNumberVerified)
      ) {
        return true
      }
    }

    return null
  }

  private hasUnverifiedOrNotDefinedData({
    email,
    mobilePhoneNumber,
    emailVerified,
    mobilePhoneNumberVerified,
    mobileStatus,
    emailStatus,
  }: {
    email: string
    mobilePhoneNumber: string
    emailVerified: boolean
    mobilePhoneNumberVerified: boolean
    mobileStatus: DataStatus
    emailStatus: DataStatus
  }): boolean {
    if ((email && !emailVerified) || emailStatus === DataStatus.NOT_DEFINED) {
      return true
    } else if (
      (mobilePhoneNumber && !mobilePhoneNumberVerified) ||
      mobileStatus === DataStatus.NOT_DEFINED
    ) {
      return true
    } else {
      return false
    }
  }

  /**
   * Checks if the audkenni phone number is the same as the mobile phone number to skip verification
   * @param audkenniSimNumber
   * @param mobilePhoneNumber
   */
  private checkAudkenniSameAsMobilePhoneNumber(
    audkenniSimNumber: string,
    mobilePhoneNumber: string,
  ): boolean {
    if (!audkenniSimNumber || !mobilePhoneNumber) {
      return false
    }

    /**
     * Remove dashes from mobile phone number and compare last 7 digits of mobilePhoneNumber with the audkenni Phone number
     * Removing the dashes prevents misreading string with format +354-765-4321 as 65-4321
     */
    return (
      mobilePhoneNumber.replace(/-/g, '').slice(-7) ===
      audkenniSimNumber.replace(/-/g, '').slice(-7)
    )
  }

  /**
   * Validates if the search term is a valid nationalId, email or an icelandic phone number
   * @param search
   * @private
   */
  private isSearchTermValid(search: string): boolean {
    try {
      if (!search) {
        return false
      } else if (
        !isEmail(search) &&
        !kennitala.isValid(search) &&
        !parsePhoneNumber(search, 'IS').isValid()
      ) {
        return false
      }
    } catch (e) {
      return false
    }

    return true
  }
}
