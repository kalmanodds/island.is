import { Alert, Button, Heading, Input, InputRow, Typography } from '@ui'
import React, { useCallback, useMemo, useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled, { useTheme } from 'styled-components'

import {
  useGetHealthCenterQuery,
  useGetHealthInsuranceOverviewQuery,
  useGetOrganDonorStatusQuery,
  useGetPaymentOverviewQuery,
  useGetPaymentStatusQuery,
} from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import externalLinkIcon from '../../assets/icons/external-link.png'
import { getConfig } from '../../config'
import { useBrowser } from '../../lib/use-browser'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { useFeatureFlag } from '../../contexts/feature-flag-provider'

const Host = styled(SafeAreaView)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const ButtonWrapper = styled(View)`
  flex-direction: row;
  margin-top: ${({ theme }) => theme.spacing[3]}px;
  margin-bottom: ${({ theme }) => -theme.spacing[1]}px;
  gap: ${({ theme }) => theme.spacing[2]}px;
`

interface HeadingSectionProps {
  title: string
  linkTextId?: string
  onPress: () => void
}

const HeadingSection: React.FC<HeadingSectionProps> = ({
  title,
  onPress,
  linkTextId,
}) => {
  const theme = useTheme()
  return (
    <TouchableOpacity onPress={onPress} style={{ marginTop: theme.spacing[2] }}>
      <Heading
        small
        button={
          <TouchableOpacity
            onPress={onPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Typography
              variant="heading5"
              color={theme.color.blue400}
              style={{ marginRight: 4 }}
            >
              <FormattedMessage id={linkTextId ?? 'button.seeAll'} />
            </Typography>
            <Image source={externalLinkIcon} />
          </TouchableOpacity>
        }
      >
        {title}
      </Heading>
    </TouchableOpacity>
  )
}

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'health.overview.screenTitle' }),
      },
    },
  }))

export const HealthOverviewScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const intl = useIntl()
  const theme = useTheme()
  const { openBrowser } = useBrowser()
  const origin = getConfig().apiUrl.replace(/\/api$/, '')
  const [refetching, setRefetching] = useState(false)
  const isOrganDonationEnabled = useFeatureFlag('isOrganDonationEnabled', false)

  const now = useMemo(() => new Date().toISOString(), [])

  const organDonationRes = useGetOrganDonorStatusQuery({
    skip: !isOrganDonationEnabled,
  })
  const healthInsuranceRes = useGetHealthInsuranceOverviewQuery()
  const healthCenterRes = useGetHealthCenterQuery()
  const paymentStatusRes = useGetPaymentStatusQuery()
  const paymentOverviewRes = useGetPaymentOverviewQuery({
    variables: {
      input: {
        // The items we are fethcing are static and are not using the dates for calculation,
        // it is though not allowed to skip them or send and empty string so we send current date for both
        dateFrom: now,
        dateTo: now,
        serviceTypeCode: '',
      },
    },
  })

  const isOrganDonor =
    organDonationRes.data?.healthDirectorateOrganDonation.donor?.isDonor

  const isOrganDonorWithLimitations =
    isOrganDonor &&
    organDonationRes.data?.healthDirectorateOrganDonation.donor?.limitations
      ?.hasLimitations

  const organLimitations = isOrganDonorWithLimitations
    ? organDonationRes.data?.healthDirectorateOrganDonation.donor?.limitations?.limitedOrgansList?.map(
        (organ) => organ.name,
      )
    : []

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: [
      healthInsuranceRes,
      healthCenterRes,
      paymentStatusRes,
      paymentOverviewRes,
    ],
  })

  const onRefresh = useCallback(async () => {
    setRefetching(true)

    try {
      const promises = [
        healthInsuranceRes.refetch(),
        healthCenterRes.refetch(),
        paymentStatusRes.refetch(),
        paymentOverviewRes.refetch(),
        isOrganDonationEnabled && organDonationRes.refetch(),
      ].filter(Boolean)
      await Promise.all(promises)
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [
    healthInsuranceRes,
    healthCenterRes,
    paymentStatusRes,
    paymentOverviewRes,
    organDonationRes,
    isOrganDonationEnabled,
  ])

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refetching} onRefresh={onRefresh} />
        }
        style={{ flex: 1 }}
      >
        <Host>
          <Heading>
            <FormattedMessage
              id="health.overview.title"
              defaultMessage="Heilsan mín"
            />
          </Heading>
          <Typography>
            <FormattedMessage
              id="health.overview.description"
              defaultMessage="Hér finnur þú þín heilsufarsgögn, heilsugæslu og sjúkratryggingar"
            />
          </Typography>
          <ButtonWrapper>
            <Button
              title={intl.formatMessage({ id: 'health.overview.therapy' })}
              isOutlined
              isUtilityButton
              icon={externalLinkIcon}
              iconStyle={{ tintColor: theme.color.dark300 }}
              style={{ flex: 1 }}
              ellipsis
              onPress={() =>
                openBrowser(
                  `${origin}/minarsidur/heilsa/thjalfun/sjukrathjalfun`,
                  componentId,
                )
              }
            />
            <Button
              title={intl.formatMessage({
                id: 'health.overview.aidsAndNutrition',
              })}
              isOutlined
              isUtilityButton
              icon={externalLinkIcon}
              iconStyle={{ tintColor: theme.color.dark300 }}
              style={{ flex: 1 }}
              ellipsis
              onPress={() =>
                openBrowser(
                  `${origin}/minarsidur/heilsa/hjalpartaeki-og-naering`,
                  componentId,
                )
              }
            />
          </ButtonWrapper>
          <HeadingSection
            title={intl.formatMessage({ id: 'health.overview.healthCenter' })}
            onPress={() =>
              openBrowser(
                `${origin}/minarsidur/heilsa/heilsugaesla`,
                componentId,
              )
            }
          />
          <InputRow background>
            <Input
              label={intl.formatMessage({
                id: 'health.overview.healthCenter',
              })}
              value={
                healthCenterRes.data
                  ?.rightsPortalHealthCenterRegistrationHistory?.current
                  ?.healthCenterName ??
                intl.formatMessage({
                  id: 'health.overview.noHealthCenterRegistered',
                })
              }
              loading={healthCenterRes.loading && !healthCenterRes.data}
              error={healthCenterRes.error && !healthCenterRes.data}
              darkBorder
            />
          </InputRow>
          <InputRow background>
            <Input
              label={intl.formatMessage({
                id: 'health.overview.physician',
              })}
              value={
                healthCenterRes.data
                  ?.rightsPortalHealthCenterRegistrationHistory?.current
                  ?.doctor ??
                intl.formatMessage({
                  id: 'health.overview.noPhysicianRegistered',
                })
              }
              loading={healthCenterRes.loading && !healthCenterRes.data}
              error={healthCenterRes.error && !healthCenterRes.data}
              noBorder
            />
          </InputRow>
          <HeadingSection
            title={intl.formatMessage({ id: 'health.overview.statusOfRights' })}
            onPress={() =>
              openBrowser(`${origin}/minarsidur/heilsa/yfirlit`, componentId)
            }
          />
          {healthInsuranceRes.data?.rightsPortalInsuranceOverview?.isInsured ||
          healthInsuranceRes.loading ? (
            <InputRow background>
              <Input
                label={intl.formatMessage({
                  id: 'health.overview.insuredFrom',
                })}
                value={
                  healthInsuranceRes.data?.rightsPortalInsuranceOverview?.from
                    ? intl.formatDate(
                        healthInsuranceRes.data?.rightsPortalInsuranceOverview
                          .from,
                      )
                    : null
                }
                loading={healthInsuranceRes.loading && !healthInsuranceRes.data}
                error={healthInsuranceRes.error && !healthInsuranceRes.data}
                noBorder
              />
              <Input
                label={intl.formatMessage({
                  id: 'health.overview.status',
                })}
                value={
                  healthInsuranceRes.data?.rightsPortalInsuranceOverview?.status
                    ?.display
                }
                loading={healthInsuranceRes.loading && !healthInsuranceRes.data}
                error={healthInsuranceRes.error && !healthInsuranceRes.data}
                noBorder
              />
            </InputRow>
          ) : (
            <Alert
              type="info"
              title={intl.formatMessage({ id: 'health.overview.notInsured' })}
              message={
                healthInsuranceRes.data?.rightsPortalInsuranceOverview
                  ?.explanation ?? ''
              }
              hasBorder
            />
          )}
          <HeadingSection
            title={intl.formatMessage({
              id: 'health.overview.payments',
            })}
            onPress={() =>
              openBrowser(
                `${origin}/minarsidur/heilsa/greidslur/greidsluthatttaka`,
                componentId,
              )
            }
          />
          <InputRow background>
            <Input
              label={intl.formatMessage({
                id: 'health.overview.maxMonthlyPayment',
              })}
              value={
                paymentStatusRes.data?.rightsPortalCopaymentStatus
                  ?.maximumMonthlyPayment
                  ? `${intl.formatNumber(
                      paymentStatusRes.data?.rightsPortalCopaymentStatus
                        ?.maximumMonthlyPayment,
                    )} kr.`
                  : '0 kr.'
              }
              loading={paymentStatusRes.loading && !paymentStatusRes.data}
              error={paymentStatusRes.error && !paymentStatusRes.data}
              darkBorder
            />
          </InputRow>
          <InputRow background>
            <Input
              label={intl.formatMessage({
                id: 'health.overview.paymentLimit',
              })}
              value={
                paymentStatusRes.data?.rightsPortalCopaymentStatus
                  ?.maximumPayment
                  ? `${intl.formatNumber(
                      paymentStatusRes.data?.rightsPortalCopaymentStatus
                        ?.maximumPayment,
                    )} kr.`
                  : '0 kr.'
              }
              loading={paymentStatusRes.loading && !paymentStatusRes.data}
              error={paymentStatusRes.error && !paymentStatusRes.data}
              darkBorder
            />
          </InputRow>
          <InputRow background>
            <Input
              label={intl.formatMessage({
                id: 'health.overview.paymentCredit',
              })}
              value={
                paymentOverviewRes.data?.rightsPortalPaymentOverview.items?.[0]
                  ?.credit
                  ? `${intl.formatNumber(
                      paymentOverviewRes.data?.rightsPortalPaymentOverview
                        .items?.[0]?.credit,
                    )} kr.`
                  : '0 kr.'
              }
              loading={paymentOverviewRes.loading && !paymentOverviewRes.data}
              error={paymentOverviewRes.error && !paymentOverviewRes.data}
              noBorder
            />
            <Input
              label={intl.formatMessage({
                id: 'health.overview.paymentDebt',
              })}
              value={
                paymentOverviewRes.data?.rightsPortalPaymentOverview.items?.[0]
                  ?.debt
                  ? `${intl.formatNumber(
                      paymentOverviewRes.data?.rightsPortalPaymentOverview
                        .items?.[0]?.debt,
                    )} kr.`
                  : '0 kr.'
              }
              loading={paymentOverviewRes.loading && !paymentOverviewRes.data}
              error={paymentOverviewRes.error && !paymentOverviewRes.data}
              noBorder
            />
          </InputRow>
          {isOrganDonationEnabled && (
            <HeadingSection
              title={intl.formatMessage({
                id: 'health.organDonation',
              })}
              linkTextId="health.organDonation.change"
              onPress={() =>
                openBrowser(
                  `${origin}/minarsidur/heilsa/liffaeragjof/skraning`,
                  componentId,
                )
              }
            />
          )}
          {isOrganDonationEnabled && (
            <InputRow background>
              <Input
                label={intl.formatMessage({
                  id: isOrganDonorWithLimitations
                    ? 'health.organDonation.isDonorWithLimitations'
                    : isOrganDonor
                    ? 'health.organDonation.isDonor'
                    : 'health.organDonation.isNotDonor',
                })}
                value={`${intl.formatMessage({
                  id: isOrganDonorWithLimitations
                    ? 'health.organDonation.isDonorWithLimitationsDescription'
                    : isOrganDonor
                    ? 'health.organDonation.isDonorDescription'
                    : 'health.organDonation.isNotDonorDescription',
                })}${
                  isOrganDonorWithLimitations
                    ? organLimitations?.join(', ')
                    : ''
                }.`}
                loading={paymentStatusRes.loading && !paymentStatusRes.data}
                error={paymentStatusRes.error && !paymentStatusRes.data}
                noBorder
              />
            </InputRow>
          )}
        </Host>
      </ScrollView>
    </View>
  )
}

HealthOverviewScreen.options = getNavigationOptions
