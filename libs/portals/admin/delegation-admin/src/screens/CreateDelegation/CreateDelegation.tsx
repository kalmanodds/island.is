import React, { useEffect, useState } from 'react'
import {
  Box,
  Stack,
  AlertMessage,
  Checkbox,
  GridColumn,
  GridRow,
  Input,
  Select,
  DatePicker,
  toast,
  Icon,
} from '@island.is/island-ui/core'
import { BackButton } from '@island.is/portals/admin/core'
import { useLocale } from '@island.is/localization'

import { IntroHeader, m as coreMessages } from '@island.is/portals/core'
import { m } from '../../lib/messages'
import { DelegationAdminPaths } from '../../lib/paths'
import NumberFormat from 'react-number-format'

import {
  Form,
  useActionData,
  useNavigate,
  useSearchParams,
  useSubmit,
} from 'react-router-dom'
import { CreateDelegationResult } from './CreateDelegation.action'
import * as styles from './CreateDelegation.css'
import { useIdentityLazyQuery } from './CreateDelegation.generated'
import debounce from 'lodash/debounce'
import cn from 'classnames'
import {
  DelegationsFormFooter,
  useDynamicShadow,
} from '@island.is/portals/shared-modules/delegations'
import { CreateDelegationConfirmModal } from '../../components/CreateDelegationConfirmModal'
import { Identity } from '@island.is/api/schema'
import kennitala from 'kennitala'
import { unmaskString } from '@island.is/shared/utils'
import { useAuth } from '@island.is/auth/react'

const CreateDelegationScreen = () => {
  const { formatMessage } = useLocale()
  const { userInfo } = useAuth()

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const submit = useSubmit()
  const actionData = useActionData() as CreateDelegationResult
  const [noEndDate, setNoEndDate] = React.useState(true)
  const [fromIdentity, setFromIdentity] = React.useState<Identity | null>(null)
  const [toIdentity, setToIdentity] = React.useState<Identity | null>(null)
  const [validTo, setValidTo] = React.useState<Date | null>(null)
  const [isConfirmed, setIsConfirmed] = React.useState(false)
  const [fromNationalId, setFromNationalId] = React.useState('')
  const [toNationalId, setToNationalId] = React.useState('')

  const fromInputRef = React.useRef<HTMLInputElement>(null)
  const toInputRef = React.useRef<HTMLInputElement>(null)
  const formRef = React.useRef<HTMLFormElement>(null)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const { showShadow } = useDynamicShadow({ rootMargin: '-112px' })
  const defaultFromNationalId = searchParams.get('fromNationalId')

  const typeOptions = [
    {
      label: formatMessage(m.typeGeneral),
      value: 'general', // Todo: change to correct enum value, yet to be created
    },
  ]

  useEffect(() => {
    if (actionData?.data && !actionData.errors) {
      setIsConfirmed(true)
      setShowConfirmModal(true)
    } else {
      setIsConfirmed(false)
    }
  }, [actionData])

  useEffect(() => {
    async function getFromNationalId() {
      const unmaskedNationalId = await unmaskString(
        defaultFromNationalId ?? '',
        userInfo?.profile.nationalId ?? '',
      )
      if (unmaskedNationalId && validateNationalId(unmaskedNationalId)) {
        setFromNationalId(unmaskedNationalId)
        getFromIdentity({
          variables: { input: { nationalId: unmaskedNationalId } },
        })
      }
    }

    getFromNationalId()
  }, [defaultFromNationalId])

  const noUserFoundToast = () => {
    toast.warning(formatMessage(m.grantIdentityError))
  }

  const [
    getFromIdentity,
    { loading: fromIdentityQueryLoading },
  ] = useIdentityLazyQuery({
    onError: (error) => {
      console.error(error)
    },
    onCompleted: (data) => {
      if (!data.identity) {
        noUserFoundToast()
      } else if (data.identity) {
        setFromIdentity(data.identity)
      }
    },
  })

  const [
    getToIdentity,
    { loading: toIdentityQueryLoading },
  ] = useIdentityLazyQuery({
    onError: (error) => {
      console.error(error)
    },
    onCompleted: (data) => {
      if (!data.identity) {
        noUserFoundToast()
      } else if (data.identity) {
        setToIdentity(data.identity)
      }
    },
  })

  const validateNationalId = (nationalId: string) => {
    const value = nationalId.replace('-', '').trim()
    return value.length === 10 && kennitala.isValid(value)
  }

  const handleNationalIdFromChange = debounce(async ({ value }) => {
    setFromNationalId(value)

    const isValid = validateNationalId(value)
    if (!isValid) {
      return
    }
    return getFromIdentity({
      variables: { input: { nationalId: value } },
    })
  }, 300)

  const handleNationalIdToChange = debounce(({ value }) => {
    setToNationalId(value)
    const isValid = validateNationalId(value)
    if (!isValid) {
      return
    }
    return getToIdentity({
      variables: { input: { nationalId: value } },
    })
  }, 300)

  const Loading = () => (
    <span className={cn(styles.icon, styles.loadingIcon)} aria-label="Loading">
      <Icon icon="reload" size="large" color="blue400" />
    </span>
  )

  const ClearButton = ({
    onClick,
    loading,
  }: {
    onClick: () => void
    loading: boolean
  }) => (
    <button
      disabled={loading}
      onClick={onClick}
      className={styles.icon}
      aria-label={formatMessage(coreMessages.clearSelected)}
    >
      <Icon icon="close" size="large" color="blue400" />
    </button>
  )

  return (
    <Stack space="containerGutter">
      <BackButton onClick={() => navigate(-1)} />
      <div>
        <IntroHeader
          title={m.createNewDelegation}
          intro={m.delegationAdminCreateNewDelegationDescription}
        />
        <Form method="post" ref={formRef}>
          <GridRow rowGap={3}>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <div className={styles.inputWrapper}>
                {fromIdentity?.name && (
                  <Input
                    name="fromName"
                    defaultValue={fromIdentity.name}
                    aria-live="assertive"
                    label={formatMessage(m.fromNationalId)}
                    backgroundColor="blue"
                    required
                  />
                )}

                <Box
                  display={fromIdentity?.name ? 'none' : 'block'}
                  aria-live="assertive"
                >
                  <NumberFormat
                    type="tel"
                    name="fromNationalId"
                    label={formatMessage(m.fromNationalId)}
                    backgroundColor="blue"
                    customInput={Input}
                    format="######-####"
                    onValueChange={handleNationalIdFromChange}
                    value={fromNationalId ?? ''}
                    required
                    getInputRef={fromInputRef}
                    errorMessage={formatMessage(
                      m[actionData?.errors?.fromNationalId as keyof typeof m],
                    )}
                  />
                </Box>
                {fromIdentityQueryLoading ? (
                  <Loading />
                ) : fromIdentity?.name ? (
                  <ClearButton
                    loading={fromIdentityQueryLoading}
                    onClick={() => {
                      setFromNationalId('')
                      setFromIdentity(null)
                      if (defaultFromNationalId) {
                        setSearchParams(
                          (params) => {
                            params.delete('fromNationalId')
                            return params
                          },
                          { replace: true },
                        )
                      }

                      setTimeout(() => {
                        if (fromInputRef.current) {
                          fromInputRef.current.focus()
                        }
                      }, 0)
                    }}
                  />
                ) : null}
              </div>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <div className={styles.inputWrapper}>
                {toIdentity?.name && (
                  <Input
                    name="toName"
                    defaultValue={toIdentity.name}
                    aria-live="assertive"
                    label={formatMessage(m.toNationalId)}
                    backgroundColor="blue"
                    required
                  />
                )}
                <Box
                  display={toIdentity?.name ? 'none' : 'block'}
                  aria-live="assertive"
                >
                  <NumberFormat
                    type="tel"
                    name="toNationalId"
                    label={formatMessage(m.toNationalId)}
                    backgroundColor="blue"
                    customInput={Input}
                    format="######-####"
                    onValueChange={handleNationalIdToChange}
                    value={toNationalId}
                    getInputRef={toInputRef}
                    required
                    errorMessage={formatMessage(
                      m[actionData?.errors?.toNationalId as keyof typeof m],
                    )}
                  />
                </Box>
                {toIdentityQueryLoading ? (
                  <Loading />
                ) : toIdentity?.name ? (
                  <ClearButton
                    loading={toIdentityQueryLoading}
                    onClick={() => {
                      setToNationalId('')
                      setToIdentity(null)
                      setTimeout(() => {
                        if (toInputRef.current) {
                          toInputRef.current.focus()
                        }
                      }, 0)
                    }}
                  />
                ) : null}
              </div>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <Select
                backgroundColor="white"
                label={formatMessage(m.type)}
                name="type"
                required
                noOptionsMessage="No options"
                defaultValue={typeOptions[0]}
                options={typeOptions}
                placeholder={formatMessage(m.type)}
                size="md"
              />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <Checkbox
                label={formatMessage(m.noEndDate)}
                name="noEndDate"
                filled
                defaultChecked
                onChange={(e) => {
                  setNoEndDate(e.target.checked)
                }}
                value={noEndDate.toString()}
              />
            </GridColumn>
            {!noEndDate && (
              <GridColumn span={['12/12', '12/12', '7/12']}>
                <DatePicker
                  name="validToPicker"
                  label={formatMessage(m.type)}
                  locale="is"
                  placeholderText={formatMessage(m.validTo)}
                  required
                  handleChange={(d) => setValidTo(d)}
                  errorMessage={formatMessage(
                    m[actionData?.errors?.validTo as keyof typeof m],
                  )}
                />
                <input
                  type="hidden"
                  name="validTo"
                  value={validTo?.toISOString()}
                />
              </GridColumn>
            )}
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <Input
                name="referenceId"
                label={formatMessage(m.referenceId)}
                backgroundColor="blue"
                required
                errorMessage={formatMessage(
                  m[actionData?.errors?.referenceId as keyof typeof m],
                )}
              />
            </GridColumn>
            <input type="hidden" name="confirmed" value={String(isConfirmed)} />
            <GridColumn span={['12/12', '12/12', '7/12']}>
              <DelegationsFormFooter
                onCancel={() => navigate(DelegationAdminPaths.Root)}
                divider={false}
                confirmLabel={formatMessage(m.create)}
                showShadow={showShadow}
                confirmIcon="arrowForward"
              />
            </GridColumn>
            {actionData?.globalError && (
              <GridColumn span={['12/12']}>
                <AlertMessage
                  title=""
                  message={formatMessage(m.errorDefault)}
                  type="error"
                />
              </GridColumn>
            )}
          </GridRow>
        </Form>
      </div>

      <CreateDelegationConfirmModal
        fromIdentity={fromIdentity}
        toIdentity={toIdentity}
        data={actionData?.data}
        isVisible={showConfirmModal}
        onClose={() => {
          setIsConfirmed(false)
          setShowConfirmModal(false)
        }}
        onConfirm={() => {
          submit(formRef.current)
          setShowConfirmModal(false)
        }}
      />
    </Stack>
  )
}

export default CreateDelegationScreen
