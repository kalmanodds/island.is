import React, { useCallback, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import router from 'next/router'

import {
  Accordion,
  AccordionItem,
  AlertMessage,
  Box,
  Button,
  Text,
} from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import {
  capitalize,
  formatCaseType,
  formatDate,
  FormatPattern,
} from '@island.is/judicial-system/formatters'
import {
  core,
  icCourtOverview,
  requestCourtDate,
  titles,
} from '@island.is/judicial-system-web/messages'
import { lawsBrokenAccordion } from '@island.is/judicial-system-web/messages/Core/lawsBrokenAccordion'
import {
  AccordionListItem,
  CaseFilesAccordionItem,
  CaseResentExplanation,
  CommentsAccordionItem,
  CourtCaseInfo,
  FormContentContainer,
  FormContext,
  FormFooter,
  InfoCard,
  InfoCardCaseScheduled,
  PageHeader,
  PageLayout,
  PdfButton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { NameAndEmail } from '@island.is/judicial-system-web/src/components/InfoCard/InfoCard'
import { CaseState } from '@island.is/judicial-system-web/src/graphql/schema'
import {
  UploadState,
  useCourtUpload,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { DraftConclusionModal } from '../../components'

const Overview = () => {
  const { workingCase, setWorkingCase, isLoadingWorkingCase, caseNotFound } =
    useContext(FormContext)
  const { formatMessage } = useIntl()

  const { user } = useContext(UserContext)
  const { uploadState } = useCourtUpload(workingCase, setWorkingCase)
  const [isDraftingConclusion, setIsDraftingConclusion] = useState<boolean>()

  const handleNavigationTo = useCallback(
    (destination: string) => router.push(`${destination}/${workingCase.id}`),
    [workingCase.id],
  )

  return (
    <PageLayout
      workingCase={workingCase}
      isLoading={isLoadingWorkingCase}
      notFound={caseNotFound}
      isValid={true}
      onNavigationTo={handleNavigationTo}
    >
      <PageHeader
        title={formatMessage(titles.court.investigationCases.overview)}
      />
      <FormContentContainer>
        {workingCase.caseResentExplanation && (
          <Box marginBottom={workingCase.openedByDefender ? 3 : 5}>
            <CaseResentExplanation
              explanation={workingCase.caseResentExplanation}
            />
          </Box>
        )}
        {workingCase.openedByDefender && (
          <Box marginBottom={5}>
            <AlertMessage
              title={formatMessage(
                icCourtOverview.sections.openedByDefenderAlert.title,
              )}
              message={formatMessage(
                icCourtOverview.sections.openedByDefenderAlert.text,
                {
                  when: formatDate(
                    workingCase.openedByDefender,
                    FormatPattern.dMMMYHHmm,
                  ),
                },
              )}
              type="info"
              testid="alertMessageOpenedByDefender"
            />
          </Box>
        )}
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            Yfirlit kröfu um rannsóknarheimild
          </Text>
        </Box>
        <CourtCaseInfo workingCase={workingCase} />
        {workingCase.state === CaseState.RECEIVED &&
          workingCase.arraignmentDate?.date &&
          workingCase.court && (
            <Box component="section" marginBottom={5}>
              <InfoCardCaseScheduled
                court={workingCase.court}
                courtDate={workingCase.arraignmentDate.date}
                courtRoom={workingCase.arraignmentDate.location}
              />
            </Box>
          )}
        <Box component="section" marginBottom={5}>
          <InfoCard
            data={[
              {
                title: formatMessage(core.policeCaseNumber),
                value: workingCase.policeCaseNumbers?.map((n) => (
                  <Text key={n}>{n}</Text>
                )),
              },
              {
                title: formatMessage(core.prosecutor),
                value: `${workingCase.prosecutorsOffice?.name}`,
              },
              {
                title: formatMessage(requestCourtDate.heading),
                value: `${capitalize(
                  formatDate(
                    workingCase.requestedCourtDate,
                    FormatPattern.ddMMYYYY,
                    true,
                  ) ?? '',
                )} eftir kl. ${formatDate(
                  workingCase.requestedCourtDate,
                  FormatPattern.HHmm,
                )}`,
              },
              {
                title: formatMessage(core.prosecutorPerson),
                value: NameAndEmail(
                  workingCase.prosecutor?.name,
                  workingCase.prosecutor?.email,
                ),
              },
              {
                title: formatMessage(core.caseType),
                value: capitalize(formatCaseType(workingCase.type)),
              },
            ]}
            defendants={
              workingCase.defendants
                ? {
                    title: capitalize(
                      formatMessage(core.defendant, {
                        suffix: workingCase.defendants.length > 1 ? 'ar' : 'i',
                      }),
                    ),
                    items: workingCase.defendants,
                  }
                : undefined
            }
            defenders={[
              {
                name: workingCase.defenderName,
                defenderNationalId: workingCase.defenderNationalId,
                sessionArrangement: workingCase.sessionArrangements,
                email: workingCase.defenderEmail,
                phoneNumber: workingCase.defenderPhoneNumber,
              },
            ]}
          />
        </Box>
        <>
          {workingCase.description && (
            <Box marginBottom={5}>
              <Box marginBottom={2}>
                <Text as="h3" variant="h3">
                  Efni kröfu
                </Text>
              </Box>
              <Text>{workingCase.description}</Text>
            </Box>
          )}
          <Box marginBottom={5} data-testid="demands">
            <Box marginBottom={2}>
              <Text as="h3" variant="h3">
                Dómkröfur
              </Text>
            </Box>
            <Text>{workingCase.demands}</Text>
          </Box>
          <Box marginBottom={5}>
            <Accordion>
              <AccordionItem
                labelVariant="h3"
                id="id_1"
                label={formatMessage(lawsBrokenAccordion.heading)}
              >
                <Text whiteSpace="breakSpaces">{workingCase.lawsBroken}</Text>
              </AccordionItem>
              <AccordionItem
                labelVariant="h3"
                id="id_2"
                label="Lagaákvæði sem krafan er byggð á"
              >
                <Text whiteSpace="breakSpaces">{workingCase.legalBasis}</Text>
              </AccordionItem>
              {(workingCase.caseFacts || workingCase.legalArguments) && (
                <AccordionItem
                  labelVariant="h3"
                  id="id_4"
                  label="Greinargerð um málsatvik og lagarök"
                >
                  {workingCase.caseFacts && (
                    <AccordionListItem title="Málsatvik">
                      <Text whiteSpace="breakSpaces">
                        {workingCase.caseFacts}
                      </Text>
                    </AccordionListItem>
                  )}
                  {workingCase.legalArguments && (
                    <AccordionListItem title="Lagarök">
                      <Text whiteSpace="breakSpaces">
                        {workingCase.legalArguments}
                      </Text>
                    </AccordionListItem>
                  )}
                </AccordionItem>
              )}
              {(workingCase.comments ||
                workingCase.caseFilesComments ||
                workingCase.caseResentExplanation) && (
                <CommentsAccordionItem workingCase={workingCase} />
              )}
              {user && (
                <CaseFilesAccordionItem
                  workingCase={workingCase}
                  setWorkingCase={setWorkingCase}
                  user={user}
                />
              )}
            </Accordion>
          </Box>
          <Box marginBottom={10}>
            <Box marginBottom={3}>
              <PdfButton
                caseId={workingCase.id}
                title={formatMessage(core.pdfButtonRequest)}
                pdfType="request"
              />
            </Box>
            <Button
              data-testid="draftConclusionButton"
              variant="ghost"
              icon="pencil"
              size="small"
              onClick={() => setIsDraftingConclusion(true)}
            >
              Skrifa drög að niðurstöðu
            </Button>
          </Box>
          <DraftConclusionModal
            workingCase={workingCase}
            setWorkingCase={setWorkingCase}
            isDraftingConclusion={isDraftingConclusion}
            setIsDraftingConclusion={setIsDraftingConclusion}
          />
        </>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          nextButtonIcon="arrowForward"
          previousUrl={`${constants.INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE}/${workingCase.id}`}
          nextIsLoading={isLoadingWorkingCase}
          onNextButtonClick={() =>
            handleNavigationTo(
              constants.INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
            )
          }
          nextIsDisabled={uploadState === UploadState.UPLOADING}
          nextButtonText={formatMessage(icCourtOverview.continueButton.label)}
        />
      </FormContentContainer>
    </PageLayout>
  )
}

export default Overview
