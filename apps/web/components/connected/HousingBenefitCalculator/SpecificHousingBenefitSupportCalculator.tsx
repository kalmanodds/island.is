import { useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLazyQuery } from '@apollo/client'

import {
  AlertMessage,
  Box,
  Button,
  Inline,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { InputController } from '@island.is/shared/form-fields'
import {
  ConnectedComponent,
  GetSpecificHousingBenefitSupportCalculationQuery,
  GetSpecificHousingBenefitSupportCalculationQueryVariables,
} from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { GET_SPECIFIC_HOUSING_BENEFIT_SUPPORT_CALCULATION } from '@island.is/web/screens/queries/HousingBenefitCalculator'

const MAX_LENGTH = 15

export const formatCurrency = (answer: number | null | undefined) => {
  if (typeof answer !== 'number') return answer
  return String(answer).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' kr.'
}

interface InputState {
  housingCost: string
  householdMemberCount: number
}

interface SpecificHousingBenefitSupportCalculatorProps {
  slice: ConnectedComponent
}

const SpecificHousingBenefitSupportCalculator = ({
  slice,
}: SpecificHousingBenefitSupportCalculatorProps) => {
  const n = useNamespace(slice.json ?? {})
  const [inputState, setInputState] = useState<InputState>({
    housingCost: '',
    householdMemberCount: 0,
  })
  const [data, setData] =
    useState<GetSpecificHousingBenefitSupportCalculationQuery>()
  const updateInputState = (key: keyof InputState, value: string | number) => {
    setInputState((prevState) => ({ ...prevState, [key]: value }))
  }

  const { control, getValues } = useForm()

  const [fetchCalculation, { loading, called, error }] = useLazyQuery<
    GetSpecificHousingBenefitSupportCalculationQuery,
    GetSpecificHousingBenefitSupportCalculationQueryVariables
  >(GET_SPECIFIC_HOUSING_BENEFIT_SUPPORT_CALCULATION, {
    onCompleted(data) {
      setData(data)
    },
  })

  const calculate = () => {
    const values = getValues() as InputState
    fetchCalculation({
      variables: {
        input: {
          numberOfHouseholdMembers: values.householdMemberCount,
          housingCostsPerMonth: Number(values.housingCost),
        },
      },
    })
  }

  const maximumHousingBenefits =
    data?.housingBenefitCalculatorSpecificSupportCalculation
      ?.maximumHousingBenefits
  const reductionsDueToHousingCosts =
    data?.housingBenefitCalculatorSpecificSupportCalculation
      ?.reductionsDueToHousingCosts
  const estimatedHousingBenefits =
    data?.housingBenefitCalculatorSpecificSupportCalculation
      ?.estimatedHousingBenefits

  const canSubmit = useMemo(() => {
    return Object.keys(inputState).every((key) => {
      if (key === 'householdMemberCount') {
        const householdMemberCount = inputState[key]
        return (
          householdMemberCount === 1 ||
          householdMemberCount === 2 ||
          householdMemberCount === 3 ||
          householdMemberCount === 4
        )
      }
      return Boolean(inputState[key as keyof InputState])
    })
  }, [inputState])

  return (
    <Box>
      <Box
        background="blue100"
        paddingY={[3, 3, 5]}
        paddingX={[3, 3, 3, 3, 12]}
        marginBottom={5}
      >
        <Stack space={5}>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              {n('numberOfHouseholdMembers', 'Fjöldi heimilismanna í húsnæði?')}
            </Text>

            <Controller
              control={control}
              name="householdMemberCount"
              defaultValue=""
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <Inline space={5} collapseBelow="sm">
                  <RadioButton
                    label="1"
                    name="oneHouseholdMember"
                    onChange={() => {
                      onChange(1)
                      updateInputState('householdMemberCount', 1)
                    }}
                    checked={value === 1}
                  />
                  <RadioButton
                    label="2"
                    name="twoHouseholdMembers"
                    onChange={() => {
                      onChange(2)
                      updateInputState('householdMemberCount', 2)
                    }}
                    checked={value === 2}
                  />
                  <RadioButton
                    label="3"
                    name="threeHouseholdMembers"
                    onChange={() => {
                      onChange(3)
                      updateInputState('householdMemberCount', 3)
                    }}
                    checked={value === 3}
                  />
                  <RadioButton
                    label={n('fourOrMore', '4 eða fleiri')}
                    name="fourOrMoreHouseholdMembers"
                    onChange={() => {
                      onChange(4)
                      updateInputState('householdMemberCount', 4)
                    }}
                    checked={value === 4}
                  />
                </Inline>
              )}
            />
          </Box>
          <Box>
            <Text variant="medium" fontWeight="light" paddingBottom={2}>
              {n('housingCostsPerMonth', 'Húsnæðiskostnaður á mánuði?')}
            </Text>
            <InputController
              id="housingCost"
              control={control}
              name="housingCost"
              label={n('housingCostLabel', 'Húsnæðiskostnaður')}
              placeholder={n('housingCostPlaceholder', 'kr.')}
              currency={true}
              type="number"
              onChange={(event) => {
                updateInputState('housingCost', event.target.value)
              }}
              size="sm"
              required={true}
              maxLength={MAX_LENGTH}
            />
          </Box>
          <Text variant="small" lineHeight="lg">
            {n(
              'calculatorDisclaimer',
              'Útreikningur húsnæðisbóta samkvæmt reiknivélinni byggir á þeim forsendum sem þú gafst upp og telst ekki bindandi ákvörðun um húsnæðisbætur. Útreikningur miðast við greiðslur húsnæðisbóta fyrir heilt almanaksár.',
            )}
          </Text>
          <Button loading={loading} onClick={calculate} disabled={!canSubmit}>
            {n('calculate', 'Reikna')}
          </Button>
        </Stack>
      </Box>
      {called && !error && data && (
        <Box
          background="blue100"
          paddingY={[3, 3, 5]}
          paddingX={[3, 3, 3, 3, 12]}
        >
          <Text variant="h3">
            <strong>{n('results', 'Niðurstöður')}</strong>
          </Text>
          <Stack space={5}>
            <Box>
              {typeof maximumHousingBenefits === 'number' && (
                <Text
                  variant="medium"
                  fontWeight="light"
                  paddingBottom={2}
                  paddingTop={5}
                >
                  {n(
                    'maximumHousingBenefits',
                    'Hámarksbætur miðað við fjölda heimilismanna eru',
                  )}{' '}
                  {formatCurrency(maximumHousingBenefits)}{' '}
                  {n('perMonth', 'á mánuði.')}
                </Text>
              )}

              <Stack space={1}>
                {typeof reductionsDueToHousingCosts === 'number' &&
                  reductionsDueToHousingCosts > 0 && (
                    <Text variant="medium" fontWeight="light">
                      {n(
                        'reductionsDueToHousingCosts',
                        'Skerðing vegna húsnæðiskostnaðar eru',
                      )}{' '}
                      {formatCurrency(reductionsDueToHousingCosts)}{' '}
                      {n('perMonth', 'á mánuði.')}
                    </Text>
                  )}
              </Stack>
            </Box>

            {typeof estimatedHousingBenefits === 'number' && (
              <Text variant="medium" fontWeight="light">
                {n('estimatedHousingBenefits', 'Áætlaðar húsnæðisbætur eru')}{' '}
                <strong>{formatCurrency(estimatedHousingBenefits)}</strong>{' '}
                {n('perMonth', 'á mánuði.')}
              </Text>
            )}
          </Stack>
        </Box>
      )}
      {!loading && called && error && (
        <AlertMessage
          type="error"
          title={n('errorOccurredTitle', 'Villa kom upp')}
          message={n('errorOccurredMessage', 'Ekki tókst að sækja niðurstöður')}
        />
      )}
    </Box>
  )
}

export default SpecificHousingBenefitSupportCalculator
