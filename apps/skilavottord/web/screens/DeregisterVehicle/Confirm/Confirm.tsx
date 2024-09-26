import { useMutation, useQuery } from '@apollo/client'
import gql from 'graphql-tag'
import { useRouter } from 'next/router'
import React, { FC, useContext, useEffect, useState } from 'react'

import {
  Box,
  Bullet,
  BulletList,
  Button,
  Hidden,
  Inline,
  LoadingDots,
  Stack,
  Text,
  toast,
} from '@island.is/island-ui/core'

import { hasPermission } from '@island.is/skilavottord-web/auth/utils'
import {
  CarDetailsBox2,
  NotFound,
  OutlinedError,
  ProcessPageLayout,
} from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'
import {
  Mutation,
  Query,
  RecyclingRequestTypes,
  RequestErrors,
  RequestStatus,
  Role,
} from '@island.is/skilavottord-web/graphql/schema'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { OutInUsage, UseStatus } from '@island.is/skilavottord-web/utils/consts'
import { getYear } from '@island.is/skilavottord-web/utils/dateUtils'
import { FormProvider, useForm } from 'react-hook-form'

const SkilavottordVehicleReadyToDeregisteredQuery = gql`
  query skilavottordVehicleReadyToDeregisteredQuery($permno: String!) {
    skilavottordVehicleReadyToDeregistered(permno: $permno) {
      vehicleId
      vehicleType
      newregDate
      vinNumber
      mileage
      recyclingRequests {
        nameOfRequestor
      }
    }
  }
`

const SkilavottordTrafficQuery = gql`
  query skilavottordTrafficQuery($permno: String!) {
    skilavottordTraffic(permno: $permno) {
      permno
      outInStatus
      useStatus
      useStatusName
    }
  }
`

const SkilavottordRecyclingRequestMutation = gql`
  mutation skilavottordRecyclingRequestMutation(
    $permno: String!
    $requestType: RecyclingRequestTypes!
  ) {
    createSkilavottordRecyclingRequest(
      permno: $permno
      requestType: $requestType
    ) {
      ... on RequestErrors {
        message
        operation
      }
      ... on RequestStatus {
        status
      }
    }
  }
`

const UpdateSkilavottordVehicleInfoMutation = gql`
  mutation updateSkilavottordVehicleInfo(
    $permno: String!
    $mileage: Float!
    $plateCount: Float!
    $plateLost: Boolean!
  ) {
    updateSkilavottordVehicleInfo(
      permno: $permno
      mileage: $mileage
      plateCount: $plateCount
      plateLost: $plateLost
    )
  }
`

const Confirm: FC<React.PropsWithChildren<unknown>> = () => {
  const [reloadFlag, setReloadFlag] = useState(false)
  const [
    vehicleReadyToDeregisteredQueryCompleted,
    setVehicleReadyToDeregisteredQueryCompleted,
  ] = useState(false)

  // Update reloadFlag to trigger the child component to reload
  const triggerReload = () => {
    setReloadFlag(true)
  }

  useEffect(() => {
    triggerReload()
  }, [setReloadFlag])

  const methods = useForm({
    mode: 'onChange',
  })
  const { watch } = methods

  const { user } = useContext(UserContext)
  const {
    t: {
      deregisterVehicle: { deregister: t },
      routes: { deregisterVehicle: routes },
    },
  } = useI18n()
  const router = useRouter()
  const { id } = router.query

  const mileageValue = watch('mileage')
  const plateLost = watch('plateLost')
  const plateCountValue = watch('plateCount')

  const { data, loading } = useQuery<Query>(
    SkilavottordVehicleReadyToDeregisteredQuery,
    {
      variables: { permno: id },
      onCompleted: (data) => {
        if (data && data.skilavottordVehicleReadyToDeregistered) {
          setVehicleReadyToDeregisteredQueryCompleted(true)
        }
      },
    },
  )

  const vehicle = data?.skilavottordVehicleReadyToDeregistered

  const { data: traffic, loading: loadingTraffic } = useQuery<Query>(
    SkilavottordTrafficQuery,
    {
      variables: { permno: id },
      skip: !vehicleReadyToDeregisteredQueryCompleted,
    },
  )

  const vehicleTrafficData = traffic?.skilavottordTraffic

  const outInStatus =
    vehicleTrafficData?.outInStatus.toLocaleUpperCase() === 'OUT'
      ? OutInUsage.OUT
      : OutInUsage.IN

  const useStatus = vehicleTrafficData?.useStatus || '01'

  const [
    setRecyclingRequest,
    { data: mutationData, error: mutationError, loading: mutationLoading },
  ] = useMutation<Mutation>(SkilavottordRecyclingRequestMutation, {
    onError() {
      return mutationError
    },
  })

  const mutationResponse = mutationData?.createSkilavottordRecyclingRequest

  useEffect(() => {
    if ((mutationResponse as RequestStatus)?.status) {
      router.replace(routes.baseRoute).then(() => toast.success(t.success))
    }
  }, [mutationResponse, router, routes, t.success])

  const [
    setVehicleRequest,
    {
      data: vehicleMutationData,
      error: vehicleMutationError,
      loading: vehicleMutationLoading,
    },
  ] = useMutation<Mutation>(UpdateSkilavottordVehicleInfoMutation, {
    onError() {
      return vehicleMutationError
    },
  })

  const vehicleMutationResponse = vehicleMutationData?.createSkilavottordVehicle

  useEffect(() => {
    if (vehicleMutationResponse as boolean) {
      router.replace(routes.baseRoute).then(() => toast.success(t.success))
    }
  }, [vehicleMutationResponse, router, routes, t.success])

  const handleConfirm = () => {
    let newMileage = mileageValue
    let plateCount = plateCountValue

    if (mileageValue !== undefined) {
      newMileage = +mileageValue.trim().replace(/\./g, '')
    } else {
      newMileage = vehicle?.mileage
    }

    // If vehicle is out of use and not using ticket, set plate count to 0
    if (outInStatus === OutInUsage.OUT && useStatus !== UseStatus.OUT_TICKET) {
      plateCount = 0
    }

    // Update vehicle table with latests information
    setVehicleRequest({
      variables: {
        permno: vehicle?.vehicleId,
        mileage: newMileage,
        plateCount,
        plateLost: !!plateLost?.length,
      },
    }).then(() => {
      // Send recycling request
      setRecyclingRequest({
        variables: {
          permno: id,
          requestType: RecyclingRequestTypes.deregistered,
        },
      })
    })
  }
  const handleBack = () => {
    router.replace(routes.select)
  }

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    return <NotFound />
  }

  if (
    mutationError ||
    mutationLoading ||
    (mutationResponse as RequestErrors)?.message ||
    vehicleMutationError ||
    vehicleMutationLoading ||
    (vehicleMutationResponse as boolean)
  ) {
    return (
      <ProcessPageLayout processType={'company'} activeSection={1}>
        {mutationLoading || vehicleMutationLoading ? (
          <Box textAlign="center">
            <Stack space={4}>
              <Text variant="h1">{t.titles.loading}</Text>
              <LoadingDots large />
            </Stack>
          </Box>
        ) : (
          <Stack space={4}>
            <Text variant="h1">{t.titles.error}</Text>
            <OutlinedError
              title={t.error.title}
              message={t.error.message}
              primaryButton={{
                text: `${t.error.primaryButton}`,
                action: handleConfirm,
              }}
              secondaryButton={{
                text: `${t.error.secondaryButton}`,
                action: handleBack,
              }}
            />
          </Stack>
        )}
      </ProcessPageLayout>
    )
  }

  return (
    <ProcessPageLayout processType={'company'} activeSection={1}>
      <Stack space={4}>
        {vehicle ? (
          <Stack space={4}>
            <Text variant="h1">{t.titles.success}</Text>
            <Text variant="intro">{t.info.success}</Text>
            <FormProvider {...methods}>
              <CarDetailsBox2
                vehicleId={vehicle.vehicleId}
                vehicleType={vehicle.vehicleType}
                modelYear={getYear(vehicle.newregDate)}
                vehicleOwner={vehicle.recyclingRequests?.[0]?.nameOfRequestor}
                vinNumber={vehicle.vinNumber}
                mileage={vehicle.mileage || 0}
                outInStatus={outInStatus}
                useStatus={useStatus || ''}
                reloadFlag={reloadFlag}
              />
            </FormProvider>
          </Stack>
        ) : (
          <Box>
            {loading || loadingTraffic ? (
              <Box textAlign="center">
                <LoadingDots large />
              </Box>
            ) : (
              <Stack space={4}>
                <Text variant="h1">{t.titles.notfound}</Text>
                <Inline space={1}>
                  <Text>{t.info.error}</Text>
                  <Text variant="h5">{id}</Text>
                </Inline>
                <BulletList type="ul">
                  <Bullet>
                    {t.info.notfound}
                    <Text variant="h5">island.is/umsoknir/skilavottord</Text>
                  </Bullet>
                </BulletList>
              </Stack>
            )}
          </Box>
        )}
        <Box width="full" display="inlineFlex" justifyContent="spaceBetween">
          <Hidden above="sm">
            <Button
              variant="ghost"
              circle
              icon="arrowBack"
              size="large"
              onClick={handleBack}
            />
          </Hidden>
          <Hidden below="md">
            <Button variant="ghost" onClick={handleBack}>
              {t.buttons.back}
            </Button>
          </Hidden>
          {vehicle && (
            <Button onClick={handleConfirm}>{t.buttons.confirm}</Button>
          )}
        </Box>
      </Stack>
    </ProcessPageLayout>
  )
}
export default Confirm
