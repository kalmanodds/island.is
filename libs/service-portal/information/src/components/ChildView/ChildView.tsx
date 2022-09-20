import React, { FC, useEffect, useState } from 'react'
import { defineMessage, FormattedMessage } from 'react-intl'

import {
  NationalRegistryChild,
  NationalRegistryChildGuardianship,
} from '@island.is/api/schema'
import * as styles from './ChildView.css'

import {
  Box,
  Button,
  Divider,
  GridColumn,
  GridRow,
  Inline,
  LoadingDots,
  Stack,
} from '@island.is/island-ui/core'
import {
  formatNationalId,
  NotFound,
  UserInfoLine,
  m,
  IntroHeader,
} from '@island.is/service-portal/core'
import { useFeatureFlagClient } from '@island.is/react/feature-flags'
import { FeatureFlagClient } from '@island.is/feature-flags'

import { useLocale, useNamespaces } from '@island.is/localization'
import { TwoColumnUserInfoLine } from '../TwoColumnUserInfoLine/TwoColumnUserInfoLine'
import ChildRegistrationModal from '../../screens/FamilyMember/ChildRegistrationModal'
import { ApolloError } from '@apollo/client/errors'

const dataNotFoundMessage = defineMessage({
  id: 'sp.family:data-not-found',
  defaultMessage: 'Gögn fundust ekki',
})

const editLink = defineMessage({
  id: 'sp.family:edit-link',
  defaultMessage: 'Breyta hjá Þjóðskrá',
})

export function getLivesWithParent(
  livingArrangementParents: Array<string> | undefined,
  parent: string | undefined,
) {
  if (!parent || !livingArrangementParents) {
    return
  }

  return livingArrangementParents.includes(parent)
}

interface Props {
  nationalId?: string
  userNationalId?: string
  userName?: string
  error?: ApolloError
  person?: NationalRegistryChild | null
  loading?: boolean
  isChild?: boolean
  hasDetails?: boolean
  guardianship?: NationalRegistryChildGuardianship | null
}

const ChildView: FC<Props> = ({
  nationalId,
  error,
  loading,
  person,
  isChild,
  hasDetails,
  guardianship,
  userNationalId,
  userName,
}) => {
  useNamespaces('sp.family')
  const { formatMessage } = useLocale()

  const livingArrangment = (
    livingArrangementParents: Array<string> | undefined,
    parent: string | undefined,
  ) => {
    return getLivesWithParent(livingArrangementParents, parent)
      ? formatMessage(m.yes)
      : formatMessage(m.no)
  }

  /**
   * The ChildRegistration module is feature flagged
   * Please remove all code when fully released.
   */
  const featureFlagClient: FeatureFlagClient = useFeatureFlagClient()
  const [modalFlagEnabled, setModalFlagEnabled] = useState<boolean>(false)
  useEffect(() => {
    const isFlagEnabled = async () => {
      const ffEnabled = await featureFlagClient.getValue(
        `servicePortalChildrenFamilyNotification`,
        false,
      )
      setModalFlagEnabled(ffEnabled as boolean)
    }
    isFlagEnabled()
  }, [])

  if (!nationalId || error || (!loading && !person))
    return (
      <NotFound
        title={defineMessage({
          id: 'sp.family:family-member-not-found',
          defaultMessage: 'Fjölskyldumeðlimur fannst ekki',
        })}
      />
    )

  console.log('guardianship?.legalDomicileParent', guardianship)
  return (
    <Box className={styles.pageWrapper}>
      {loading ? (
        <Box marginBottom={6}>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '6/8', '6/8']}>
              <LoadingDots />
            </GridColumn>
          </GridRow>
        </Box>
      ) : (
        <Box printHidden>
          <IntroHeader
            hideImgPrint
            title={person?.fullName ?? ''}
            intro={{
              id: 'sp.family:data-info-child',
              defaultMessage:
                'Hér fyrir neðan eru gögn um fjölskyldumeðlim. Þú hefur kost á að gera breytingar á eftirfarandi upplýsingum ef þú kýst.',
            }}
          />
        </Box>
      )}
      <Box printHidden>
        <GridRow>
          <GridColumn paddingBottom={4} span="12/12">
            <Box
              display="flex"
              justifyContent="flexStart"
              flexDirection={['column', 'row']}
            >
              <Inline space={2}>
                {!loading && !isChild && !modalFlagEnabled && (
                  <>
                    <ChildRegistrationModal
                      data={{
                        parentName: userName || '',
                        parentNationalId: userNationalId || '',
                        childName: person?.fullName || '',
                        childNationalId: nationalId,
                      }}
                    />

                    <Button
                      variant="utility"
                      size="small"
                      onClick={() => window.print()}
                      icon="print"
                      iconType="filled"
                    >
                      {formatMessage(m.print)}
                    </Button>
                  </>
                )}
              </Inline>
            </Box>
          </GridColumn>
        </GridRow>
      </Box>
      <Stack space={6}>
        <Stack component="ul" space={2}>
          <UserInfoLine
            title={formatMessage(m.myRegistration)}
            label={formatMessage(m.fullName)}
            content={person?.fullName || '...'}
            loading={loading}
            editLink={
              !isChild
                ? {
                    title: editLink,
                    external: true,
                    url:
                      'https://www.skra.is/umsoknir/eydublod-umsoknir-og-vottord/stok-vara/?productid=703760ac-686f-11e6-943e-005056851dd2',
                  }
                : undefined
            }
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          <UserInfoLine
            label={formatMessage(m.natreg)}
            content={formatNationalId(nationalId)}
            loading={loading}
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          <UserInfoLine
            label={defineMessage(m.legalResidence)}
            content={person?.legalResidence || ''}
            loading={loading}
            className={styles.printable}
            editLink={
              !isChild
                ? {
                    title: editLink,
                    external: true,
                    url: 'https://skra.is/folk/flutningur/flutningur-barna/',
                  }
                : undefined
            }
          />
          <Box printHidden>
            <Divider />
          </Box>
        </Stack>
        <Stack component="ul" space={2}>
          <UserInfoLine
            title={formatMessage(m.baseInfo)}
            label={formatMessage({
              id: 'sp.family:birthplace',
              defaultMessage: 'Fæðingarstaður',
            })}
            content={
              error
                ? formatMessage(dataNotFoundMessage)
                : person?.birthplace || ''
            }
            loading={loading}
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          <UserInfoLine
            label={formatMessage(m.religion)}
            content={
              error
                ? formatMessage(dataNotFoundMessage)
                : person?.religion || ''
            }
            loading={loading}
            editLink={
              !isChild
                ? {
                    title: editLink,
                    external: true,
                    url:
                      'https://www.skra.is/umsoknir/rafraen-skil/tru-eda-lifsskodunarfelag-barna-15-ara-og-yngri/',
                  }
                : undefined
            }
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          <UserInfoLine
            label={formatMessage(m.gender)}
            content={
              error
                ? formatMessage(dataNotFoundMessage)
                : person?.genderDisplay || ''
            }
            loading={loading}
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          <UserInfoLine
            label={formatMessage(m.citizenship)}
            content={
              error
                ? formatMessage(dataNotFoundMessage)
                : person?.nationality || ''
            }
            loading={loading}
            className={styles.printable}
          />
          <Box printHidden>
            <Divider />
          </Box>
          {person?.fate && (
            <>
              <UserInfoLine
                label={formatMessage({
                  id: 'sp.family:fate',
                  defaultMessage: 'Afdrif',
                })}
                content={
                  error
                    ? formatMessage(dataNotFoundMessage)
                    : person?.fate || ''
                }
                loading={loading}
                className={styles.printable}
              />
              <Box printHidden>
                <Divider />
              </Box>
            </>
          )}
        </Stack>
        <Stack component="ul" space={2}>
          {(person?.parent1 || person?.parent2 || loading) && (
            <>
              <TwoColumnUserInfoLine
                title={formatMessage({
                  id: 'sp.family:parents',
                  defaultMessage: 'Foreldrar',
                })}
                label={formatMessage(m.name)}
                firstValue={person?.nameParent1}
                secondValue={person?.nameParent2}
                loading={loading}
                className={styles.printable}
              />
              <Box printHidden>
                <Divider />
              </Box>
              <TwoColumnUserInfoLine
                label={formatMessage(m.natreg)}
                firstValue={
                  person?.parent1 ? formatNationalId(person.parent1) : ''
                }
                secondValue={
                  person?.parent2 ? formatNationalId(person.parent2) : ''
                }
                loading={loading}
                className={styles.printable}
              />
              <Box printHidden>
                <Divider />
              </Box>
            </>
          )}
          {!person?.fate && !error && hasDetails && (
            <>
              <TwoColumnUserInfoLine
                title={formatMessage({
                  id: 'sp.family:custody-parents',
                  defaultMessage: 'Forsjáraðilar',
                })}
                label={formatMessage({
                  id: 'sp.family:name',
                  defaultMessage: 'Nafn',
                })}
                firstValue={person?.nameCustody1}
                secondValue={person?.nameCustody2}
                loading={loading}
                className={styles.printable}
              />
              <Box printHidden>
                <Divider />
              </Box>
              <TwoColumnUserInfoLine
                label={formatMessage(m.natreg)}
                firstValue={
                  person?.custody1 ? formatNationalId(person.custody1) : ''
                }
                secondValue={
                  person?.custody2 ? formatNationalId(person.custody2) : ''
                }
                loading={loading}
                className={styles.printable}
              />
              <Box printHidden>
                <Divider />
              </Box>
              <TwoColumnUserInfoLine
                label={formatMessage({
                  id: 'sp.family:custody-status',
                  defaultMessage: 'Staða forsjár',
                })}
                firstValue={person?.custodyText1}
                secondValue={person?.custodyText2}
                loading={loading}
                className={styles.printable}
              />
              <Box printHidden>
                <Divider />
              </Box>
              {(guardianship || loading) && (
                <>
                  {guardianship?.legalDomicileParent && (
                    <>
                      <TwoColumnUserInfoLine
                        label={formatMessage({
                          id: 'sp.family:legal-domicile-parent',
                          defaultMessage: 'Lögheimilsforeldri',
                        })}
                        firstValue={livingArrangment(
                          guardianship?.legalDomicileParent ?? [],
                          person?.parent1 ?? '',
                        )}
                        secondValue={livingArrangment(
                          guardianship?.legalDomicileParent ?? [],
                          person?.parent2 ?? '',
                        )}
                        loading={loading}
                      />
                      <Divider />
                    </>
                  )}
                  {guardianship?.residenceParent && (
                    <>
                      <TwoColumnUserInfoLine
                        label={formatMessage({
                          id: 'sp.family:residence-parent',
                          defaultMessage: 'Búsetuforeldri',
                        })}
                        firstValue={livingArrangment(
                          guardianship?.residenceParent ?? [],
                          person?.parent1 ?? '',
                        )}
                        secondValue={livingArrangment(
                          guardianship?.residenceParent ?? [],
                          person?.parent2 ?? '',
                        )}
                        loading={loading}
                      />
                      <Divider />
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}
export default ChildView
