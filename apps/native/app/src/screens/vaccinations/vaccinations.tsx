import { Heading, Typography } from '@ui'
import React, { useCallback, useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { RefreshControl, SafeAreaView, ScrollView, View } from 'react-native'
import { NavigationFunctionComponent } from 'react-native-navigation'
import styled, { useTheme } from 'styled-components'

import { useGetVaccinationsQuery } from '../../graphql/types/schema'
import { createNavigationOptionHooks } from '../../hooks/create-navigation-option-hooks'
import { useConnectivityIndicator } from '../../hooks/use-connectivity-indicator'
import { VaccinationsCardContainer } from './components/vaccination-card-container'

const Host = styled(SafeAreaView)`
  padding-horizontal: ${({ theme }) => theme.spacing[2]}px;
  margin-bottom: ${({ theme }) => theme.spacing[4]}px;
`

const Vaccinations = styled(View)`
  margin-top: ${({ theme }) => theme.spacing[3]}px;
`

const { getNavigationOptions, useNavigationOptions } =
  createNavigationOptionHooks((theme, intl) => ({
    topBar: {
      title: {
        text: intl.formatMessage({ id: 'health.vaccinations.screenTitle' }),
      },
    },
  }))

export const VaccinationsScreen: NavigationFunctionComponent = ({
  componentId,
}) => {
  useNavigationOptions(componentId)
  const theme = useTheme()
  const [refetching, setRefetching] = useState(false)

  const vaccinationsRes = useGetVaccinationsQuery()

  const vaccinations =
    vaccinationsRes.data?.healthDirectorateVaccinations.vaccinations ?? []

  useConnectivityIndicator({
    componentId,
    refetching,
    queryResult: [vaccinationsRes],
  })

  const onRefresh = useCallback(async () => {
    setRefetching(true)

    try {
      vaccinationsRes.refetch()
    } catch (e) {
      // noop
    } finally {
      setRefetching(false)
    }
  }, [vaccinationsRes])

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
              id="health.vaccinations.title"
              defaultMessage="Bólusetningar"
            />
          </Heading>
          <Typography>
            <FormattedMessage
              id="health.vaccinations.description"
              defaultMessage="Hér getur þú séð lista yfir bóluefni sem þú hefur fengið, stöðu bólusetningar og aðrar upplýsingar."
            />
          </Typography>
          <Vaccinations>
            {vaccinations.map((vaccination, index) => (
              <VaccinationsCardContainer
                key={index}
                vaccination={vaccination}
                loading={vaccinationsRes.loading && !vaccinationsRes.data}
                componentId={componentId}
              />
            ))}
          </Vaccinations>
        </Host>
      </ScrollView>
    </View>
  )
}

VaccinationsScreen.options = getNavigationOptions
