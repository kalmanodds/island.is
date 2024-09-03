import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  Box,
  Input,
  InputFileUpload,
  RadioButton,
  Select,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { courtSessionTypeNames } from '@island.is/judicial-system/types'
import { core, titles } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  CourtArrangements,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  PageHeader,
  PageLayout,
  PageTitle,
  SectionHeading,
  useCourtArrangements,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseFileCategory,
  CaseIndictmentRulingDecision,
  CourtSessionType,
  IndictmentDecision,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { stepValidationsType } from '@island.is/judicial-system-web/src/utils/formHelper'
import {
  formatDateForServer,
  UpdateCase,
  useCase,
  useS3Upload,
  useUploadFiles,
} from '@island.is/judicial-system-web/src/utils/hooks'

import SelectConnectedCase from './SelectConnectedCase'
import { strings } from './Conclusion.strings'

const courtSessionOptions = [
  {
    label: courtSessionTypeNames[CourtSessionType.MAIN_HEARING],
    value: CourtSessionType.MAIN_HEARING,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.OTHER],
    value: CourtSessionType.OTHER,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.APPRAISER_SUMMONS],
    value: CourtSessionType.APPRAISER_SUMMONS,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.VERDICT],
    value: CourtSessionType.VERDICT,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.MAIN_HEARING_CONTINUATION],
    value: CourtSessionType.MAIN_HEARING_CONTINUATION,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.HEARING],
    value: CourtSessionType.HEARING,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.ORAL_ARGUMENTS],
    value: CourtSessionType.ORAL_ARGUMENTS,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.RULING],
    value: CourtSessionType.RULING,
  },
  {
    label: courtSessionTypeNames[CourtSessionType.ARRAIGNMENT],
    value: CourtSessionType.ARRAIGNMENT,
  },
]

const Conclusion: FC = () => {
  const { formatMessage } = useIntl()
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { isUpdatingCase, setAndSendCaseToServer } = useCase()
  const { courtDate, handleCourtDateChange, handleCourtRoomChange } =
    useCourtArrangements(workingCase, setWorkingCase, 'courtDate')
  const {
    uploadFiles,
    allFilesDoneOrError,
    addUploadFiles,
    updateUploadFile,
    removeUploadFile,
  } = useUploadFiles(workingCase.caseFiles)
  const { handleUpload, handleRetry, handleRemove } = useS3Upload(
    workingCase.id,
  )

  const [selectedAction, setSelectedAction] = useState<IndictmentDecision>()
  const [postponementReason, setPostponementReason] = useState<string>()
  const [selectedCourtSessionType, setSelectedCourtSessionType] =
    useState<CourtSessionType>()
  const [selectedDecision, setSelectedDecision] =
    useState<CaseIndictmentRulingDecision>()

  const handleNavigationTo = useCallback(
    async (destination: keyof stepValidationsType) => {
      if (!selectedAction) {
        return
      }

      const update: UpdateCase = {
        indictmentDecision: selectedAction,
        courtSessionType: null,
        courtDate: null,
        postponedIndefinitelyExplanation: null,
        indictmentRulingDecision: null,
        force: true,
      }

      switch (selectedAction) {
        case IndictmentDecision.POSTPONING:
          update.postponedIndefinitelyExplanation = postponementReason
          break
        case IndictmentDecision.SCHEDULING:
          update.courtSessionType = selectedCourtSessionType
          if (courtDate?.date) {
            update.courtDate = {
              date: formatDateForServer(new Date(courtDate.date)),
              location: courtDate.location,
            }
          }
          break
        case IndictmentDecision.COMPLETING:
          update.indictmentRulingDecision = selectedDecision
          update.mergeCaseId =
            selectedDecision === CaseIndictmentRulingDecision.MERGE
              ? workingCase.mergeCase?.id
              : null

          break
        case IndictmentDecision.REDISTRIBUTING:
          update.judgeId = null
          break
      }

      const updateSuccess = await setAndSendCaseToServer(
        [update],
        workingCase,
        setWorkingCase,
      )

      if (!updateSuccess) {
        return
      }

      router.push(
        selectedAction === IndictmentDecision.REDISTRIBUTING
          ? destination
          : `${destination}/${workingCase.id}`,
      )
    },
    [
      courtDate?.date,
      courtDate?.location,
      postponementReason,
      selectedAction,
      selectedCourtSessionType,
      selectedDecision,
      setAndSendCaseToServer,
      setWorkingCase,
      workingCase,
    ],
  )

  useEffect(() => {
    if (!workingCase.indictmentDecision) {
      return
    }

    switch (workingCase.indictmentDecision) {
      case IndictmentDecision.POSTPONING:
        if (workingCase.postponedIndefinitelyExplanation) {
          setPostponementReason(workingCase.postponedIndefinitelyExplanation)
        }
        setSelectedAction(IndictmentDecision.SCHEDULING)
        break
      case IndictmentDecision.SCHEDULING:
        if (workingCase.courtSessionType) {
          setSelectedCourtSessionType(workingCase.courtSessionType)
        }
        setSelectedAction(IndictmentDecision.SCHEDULING)
        break
      case IndictmentDecision.COMPLETING:
        if (workingCase.indictmentRulingDecision) {
          setSelectedDecision(workingCase.indictmentRulingDecision)
        }
        setSelectedAction(IndictmentDecision.COMPLETING)
        break
      default:
        setSelectedAction(IndictmentDecision.SCHEDULING)
    }
  }, [
    workingCase.courtSessionType,
    workingCase.indictmentDecision,
    workingCase.indictmentRulingDecision,
    workingCase.postponedIndefinitelyExplanation,
  ])

  const stepIsValid = () => {
    // Do not leave any downloads unfinished
    if (!allFilesDoneOrError) {
      return false
    }

    switch (selectedAction) {
      case IndictmentDecision.POSTPONING:
        return Boolean(postponementReason)
      case IndictmentDecision.SCHEDULING:
        return Boolean(selectedCourtSessionType && courtDate?.date)
      case IndictmentDecision.COMPLETING:
        switch (selectedDecision) {
          case CaseIndictmentRulingDecision.RULING:
          case CaseIndictmentRulingDecision.DISMISSAL:
            return (
              uploadFiles.some(
                (file) =>
                  file.category === CaseFileCategory.COURT_RECORD &&
                  file.status === 'done',
              ) &&
              uploadFiles.some(
                (file) =>
                  file.category === CaseFileCategory.RULING &&
                  file.status === 'done',
              )
            )
          case CaseIndictmentRulingDecision.CANCELLATION:
          case CaseIndictmentRulingDecision.FINE:
            return uploadFiles.some(
              (file) =>
                file.category === CaseFileCategory.COURT_RECORD &&
                file.status === 'done',
            )
          case CaseIndictmentRulingDecision.MERGE:
            return Boolean(
              uploadFiles.some(
                (file) =>
                  file.category === CaseFileCategory.COURT_RECORD &&
                  file.status === 'done',
              ) && workingCase.mergeCase?.id,
            )
          default:
            return false
        }
      case IndictmentDecision.POSTPONING_UNTIL_VERDICT:
      case IndictmentDecision.REDISTRIBUTING:
        return true
      default:
        return false
    }
  }

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={stepIsValid()}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader title={formatMessage(titles.court.indictments.conclusion)} />
      <FormContentContainer>
        <PageTitle>{formatMessage(strings.title)}</PageTitle>
        <CourtCaseInfo workingCase={workingCase} />
        <Box component="section" marginBottom={5}>
          <SectionHeading
            title={formatMessage(strings.decisionTitle)}
            required
          />
          <BlueBox>
            <Box marginBottom={2}>
              <RadioButton
                id="conclusion-postponing"
                name="conclusion-decision"
                checked={selectedAction === IndictmentDecision.POSTPONING}
                onChange={() => {
                  setSelectedAction(IndictmentDecision.POSTPONING)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.postponing)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="conclusion-scheduling"
                name="conclusion-decision"
                checked={selectedAction === IndictmentDecision.SCHEDULING}
                onChange={() => {
                  setSelectedAction(IndictmentDecision.SCHEDULING)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.scheduling)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="conclusion-postponing-until-verdict"
                name="conclusion-decision"
                checked={
                  selectedAction === IndictmentDecision.POSTPONING_UNTIL_VERDICT
                }
                onChange={() => {
                  setSelectedAction(IndictmentDecision.POSTPONING_UNTIL_VERDICT)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.postponingUntilVerdict)}
              />
            </Box>
            <Box marginBottom={2}>
              <RadioButton
                id="conclusion-completing"
                name="conclusion-decision"
                checked={selectedAction === IndictmentDecision.COMPLETING}
                onChange={() => {
                  setSelectedAction(IndictmentDecision.COMPLETING)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.completing)}
              />
            </Box>
            <RadioButton
              id="conclusion-redistributing"
              name="conclusion-redistribute"
              checked={selectedAction === IndictmentDecision.REDISTRIBUTING}
              onChange={() => {
                setSelectedAction(IndictmentDecision.REDISTRIBUTING)
              }}
              large
              backgroundColor="white"
              label={formatMessage(strings.redistributing)}
            />
          </BlueBox>
        </Box>
        {selectedAction === IndictmentDecision.POSTPONING && (
          <Box marginBottom={5}>
            <SectionHeading title={formatMessage(strings.postponingTitle)} />
            <Input
              name="reasonForPostponement"
              rows={10}
              autoExpand={{ on: true, maxHeight: 600 }}
              label={formatMessage(strings.reasonForPostponementTitle)}
              placeholder={formatMessage(
                strings.reasonForPostponementPlaceholder,
              )}
              value={postponementReason}
              onChange={(event) => setPostponementReason(event.target.value)}
              textarea
              required
            />
          </Box>
        )}
        {selectedAction === IndictmentDecision.SCHEDULING && (
          <Box marginBottom={5}>
            <SectionHeading title={formatMessage(strings.schedulingTitle)} />
            <BlueBox>
              <Box marginBottom={2}>
                <Select
                  name="court-session-type"
                  label={formatMessage(strings.courtSessionLabel)}
                  placeholder={formatMessage(strings.courtSessionPlaceholder)}
                  options={courtSessionOptions}
                  value={
                    selectedCourtSessionType &&
                    courtSessionOptions.find(
                      (option) => option.value === selectedCourtSessionType,
                    )
                  }
                  onChange={(selectedOption) => {
                    const type = selectedOption?.value
                    setSelectedCourtSessionType(type)
                  }}
                  required
                />
              </Box>
              <CourtArrangements
                handleCourtDateChange={handleCourtDateChange}
                handleCourtRoomChange={handleCourtRoomChange}
                courtDate={workingCase.courtDate}
                blueBox={false}
              />
            </BlueBox>
          </Box>
        )}
        {selectedAction === IndictmentDecision.COMPLETING && (
          <Box marginBottom={5}>
            <SectionHeading
              title={formatMessage(strings.completingTitle)}
              required
            />
            <BlueBox>
              <Box marginBottom={2}>
                <RadioButton
                  id="decision-ruling"
                  name="decision"
                  checked={
                    selectedDecision === CaseIndictmentRulingDecision.RULING
                  }
                  onChange={() => {
                    setSelectedDecision(CaseIndictmentRulingDecision.RULING)
                  }}
                  large
                  backgroundColor="white"
                  label={formatMessage(strings.ruling)}
                />
              </Box>
              <Box marginBottom={2}>
                <RadioButton
                  id="decision-fine"
                  name="decision"
                  checked={
                    selectedDecision === CaseIndictmentRulingDecision.FINE
                  }
                  onChange={() => {
                    setSelectedDecision(CaseIndictmentRulingDecision.FINE)
                  }}
                  large
                  backgroundColor="white"
                  label={formatMessage(strings.fine)}
                />
              </Box>
              <Box marginBottom={2}>
                <RadioButton
                  id="decision-dismissal"
                  name="decision"
                  checked={
                    selectedDecision === CaseIndictmentRulingDecision.DISMISSAL
                  }
                  onChange={() => {
                    setSelectedDecision(CaseIndictmentRulingDecision.DISMISSAL)
                  }}
                  large
                  backgroundColor="white"
                  label={formatMessage(strings.dismissal)}
                />
              </Box>
              <Box marginBottom={2}>
                <RadioButton
                  id="decision-merge"
                  name="decision"
                  checked={
                    selectedDecision === CaseIndictmentRulingDecision.MERGE
                  }
                  onChange={() => {
                    setSelectedDecision(CaseIndictmentRulingDecision.MERGE)
                  }}
                  large
                  backgroundColor="white"
                  label={formatMessage(strings.merge)}
                />
              </Box>
              <RadioButton
                id="decision-cancellation"
                name="decision"
                checked={
                  selectedDecision === CaseIndictmentRulingDecision.CANCELLATION
                }
                onChange={() => {
                  setSelectedDecision(CaseIndictmentRulingDecision.CANCELLATION)
                }}
                large
                backgroundColor="white"
                label={formatMessage(strings.cancellation)}
              />
            </BlueBox>
          </Box>
        )}
        {selectedDecision &&
          selectedDecision === CaseIndictmentRulingDecision.MERGE && (
            <Box marginBottom={5}>
              <SectionHeading
                title={formatMessage(strings.connectedCaseNumbersTitle)}
                required
              />
              <SelectConnectedCase
                workingCase={workingCase}
                setWorkingCase={setWorkingCase}
              />
            </Box>
          )}
        {selectedAction && (
          <Box
            component="section"
            marginBottom={selectedDecision === 'RULING' ? 5 : 10}
          >
            <SectionHeading
              title={formatMessage(strings.courtRecordTitle)}
              required={selectedAction === IndictmentDecision.COMPLETING}
            />
            <InputFileUpload
              fileList={uploadFiles.filter(
                (file) => file.category === CaseFileCategory.COURT_RECORD,
              )}
              accept="application/pdf"
              header={formatMessage(strings.inputFieldLabel)}
              description={formatMessage(core.uploadBoxDescription, {
                fileEndings: '.pdf',
              })}
              buttonLabel={formatMessage(strings.uploadButtonText)}
              onChange={(files) => {
                handleUpload(
                  addUploadFiles(files, {
                    category: CaseFileCategory.COURT_RECORD,
                  }),
                  updateUploadFile,
                )
              }}
              onRemove={(file) => handleRemove(file, removeUploadFile)}
              onRetry={(file) => handleRetry(file, updateUploadFile)}
            />
          </Box>
        )}
        {selectedAction === IndictmentDecision.COMPLETING &&
          (selectedDecision === CaseIndictmentRulingDecision.RULING ||
            selectedDecision === CaseIndictmentRulingDecision.DISMISSAL) && (
            <Box component="section" marginBottom={10}>
              <SectionHeading
                title={formatMessage(
                  selectedDecision === CaseIndictmentRulingDecision.RULING
                    ? strings.verdictUploadTitle
                    : strings.rulingUploadTitle,
                )}
                required
              />
              <InputFileUpload
                fileList={uploadFiles.filter(
                  (file) => file.category === CaseFileCategory.RULING,
                )}
                accept="application/pdf"
                header={formatMessage(strings.inputFieldLabel)}
                description={formatMessage(core.uploadBoxDescription, {
                  fileEndings: '.pdf',
                })}
                buttonLabel={formatMessage(strings.uploadButtonText)}
                onChange={(files) => {
                  handleUpload(
                    addUploadFiles(files, {
                      category: CaseFileCategory.RULING,
                    }),
                    updateUploadFile,
                  )
                }}
                onRemove={(file) => handleRemove(file, removeUploadFile)}
                onRetry={(file) => handleRetry(file, updateUploadFile)}
              />
            </Box>
          )}
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INDICTMENTS_DEFENDER_ROUTE}/${workingCase.id}`}
          onNextButtonClick={() =>
            handleNavigationTo(
              selectedAction === IndictmentDecision.COMPLETING
                ? constants.INDICTMENTS_SUMMARY_ROUTE
                : selectedAction === IndictmentDecision.REDISTRIBUTING
                ? constants.CASES_ROUTE
                : constants.INDICTMENTS_COURT_OVERVIEW_ROUTE,
            )
          }
          nextButtonText={
            selectedAction === IndictmentDecision.COMPLETING
              ? undefined
              : formatMessage(strings.nextButtonTextConfirm)
          }
          nextIsDisabled={!stepIsValid()}
          nextIsLoading={isUpdatingCase}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Conclusion
