import { FieldBaseProps } from '@island.is/application/types'
import { FC, useEffect, useState } from 'react'
import {
  AlertMessage,
  Box,
  RadioButton,
  Select,
  Text,
} from '@island.is/island-ui/core'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import {
  Group,
  Item,
  MultiSelectDropdownController,
  OptionWithKey,
} from '../Components/MultiSelectDropdownController'
import { useLocale } from '@island.is/localization'
import { causeAndConsequences } from '../../lib/messages'
import { Controller, useFormContext } from 'react-hook-form'
import { Option } from '../Components/types'
import { MessageDescriptor } from 'react-intl'

type CausesAndEffectsProps = {
  externalDataKey: string // Example aoshData.data.physicalActivities
  heading: MessageDescriptor // Contentful translation
  subHeading: MessageDescriptor // Contentful translation
  answerId: string // Example circumstances.physicalActivities
  mostSeriousAnswerId: string // Example circumstances.physicialActivitesMostSerious
  screenId: string // Example circumstances ... used to find answers to autofill
  mostSeriousAnswer?: string // Example physicialActivitiesMostSerious ... used to find answers to autofill
}

export type OptionAndKey = {
  option: Option
  key: string
}

export const CausesAndEffects: FC<
  React.PropsWithChildren<CausesAndEffectsProps & FieldBaseProps>
> = (props) => {
  const {
    application,
    externalDataKey,
    heading,
    subHeading,
    screenId,
    mostSeriousAnswer,
    mostSeriousAnswerId,
    errors,
  } = props
  //const answers = application.answers as WorkAccidentNotification
  const { setValue, getValues } = useFormContext()
  const { formatMessage } = useLocale()
  const [mostSerious, setMostSeriousList] = useState<Option[]>([])
  const [mostSeriousChosen, setMostSeriousChosen] = useState<string>(
    mostSeriousAnswer || '',
  )

  const [pickedValue, setPickedValue] = useState<OptionAndKey>()
  const activityGroups = (
    getValueViaPath(application.externalData, externalDataKey) as Group[]
  ).filter((group) => !group.validToSelect)
  const activites = (
    getValueViaPath(application.externalData, externalDataKey) as Item[]
  ).filter((group) => group.validToSelect)

  const onChange = (answers: OptionWithKey) => {
    const options: Option[] = []
    for (const key in answers) {
      answers[key].forEach((option) => {
        options.push(option)
      })
    }

    if (!options.some((option) => option.value === mostSeriousChosen)) {
      setValue(mostSeriousAnswerId, undefined)
      setMostSeriousChosen('')
    }
    // Check if mostSeriousChosen exists in the options list.
    // If it does not exists. Remove if from answers.

    setMostSeriousList(options)
  }

  useEffect(() => {
    if (mostSeriousAnswer) {
      setValue(mostSeriousAnswerId, mostSeriousAnswer)
    }
  }, [mostSeriousAnswer, mostSeriousAnswerId, setValue])

  // TODO(balli) Need to cover case where user chooses a most serious circumstance and then removes that option from the list
  return (
    <Box>
      <Box marginBottom={2} marginTop={2}>
        <Controller
          render={() => {
            return (
              <Select
                name=""
                options={activites.map((activity) => ({
                  value: activity.code,
                  label: activity.name,
                }))}
                backgroundColor="blue"
                placeholder={formatMessage(
                  causeAndConsequences.shared.searchPlaceholder,
                )}
                onChange={(value) => {
                  const code = value?.value.substring(0, 1)
                  const activity: Option = {
                    value: value?.value || '',
                    label: value?.label || '',
                  }
                  if (!code) return
                  setPickedValue({
                    option: activity,
                    key: code,
                  })
                }}
                icon="search"
              />
            )
          }}
          name={`searchBar.${screenId}`}
        />
      </Box>
      <Box>
        <Text variant="h4" marginBottom={1}>
          {formatMessage(heading)}
        </Text>
        <Text variant="small">{formatMessage(subHeading)}</Text>
      </Box>
      <Box>
        <MultiSelectDropdownController
          onAnswerChange={onChange}
          groups={activityGroups}
          items={activites}
          pickedValue={pickedValue}
          // answerId sent with ...props
          {...props}
        />
      </Box>
      {mostSerious.length > 1 ? (
        <Box marginTop={2} border="standard" padding={4}>
          <Box marginBottom={2}>
            <AlertMessage
              type="warning"
              message={'Hakaðu við það sem þú telur að sé alvarlegast.'} // TODO translate etc..
            />
            {errors && getErrorViaPath(errors, mostSeriousAnswerId) && (
              // TODO Have something design for displaying error ?
              <Box paddingTop={2}>
                <AlertMessage
                  type="error"
                  message={'Vinsamlegast veldur eitt af eftirfarandi'} // TODO translate etc..
                />
              </Box>
            )}
          </Box>
          <Box>
            {mostSerious.map((item, index) => {
              return (
                <Box
                  marginBottom={1}
                  key={`${item.label}-${index}-radio`}
                  id={mostSeriousAnswerId}
                >
                  <RadioButton
                    id={`${item.label}-${index}-radio`}
                    name={`most serious-${index}`}
                    label={item.label}
                    value={item.value}
                    checked={item.value === mostSeriousChosen}
                    backgroundColor="white"
                    onChange={(e) => {
                      setMostSeriousChosen(e.target.value)
                      setValue(mostSeriousAnswerId, e.target.value)
                    }}
                  />
                </Box>
              )
            })}
          </Box>
        </Box>
      ) : null}
    </Box>
  )
}
