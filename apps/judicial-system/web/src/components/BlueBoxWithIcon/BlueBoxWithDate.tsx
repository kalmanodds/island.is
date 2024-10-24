import { FC, useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import addDays from 'date-fns/addDays'
import { AnimatePresence, motion } from 'framer-motion'
import { height } from 'pdfkit/js/page'

import {
  Box,
  Button,
  Icon,
  IconMapIcon,
  Text,
  toast,
} from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { errors } from '@island.is/judicial-system-web/messages'

import { CaseIndictmentRulingDecision, Defendant } from '../../graphql/schema'
import { formatDateForServer, useDefendants } from '../../utils/hooks'
import DateTime from '../DateTime/DateTime'
import { FormContext } from '../FormProvider/FormProvider'
import { getAppealExpirationInfo } from '../InfoCard/DefendantInfo/DefendantInfo'
import SectionHeading from '../SectionHeading/SectionHeading'
import { strings } from './BlueBoxWithDate.strings'
import * as styles from './BlueBoxWithIcon.css'

interface Props {
  defendant: Defendant
  indictmentRulingDecision?: CaseIndictmentRulingDecision | null
  icon?: IconMapIcon
}

type DateType = 'verdictViewDate' | 'appealDate'

const BlueBoxWithDate: FC<Props> = (props) => {
  const { defendant, indictmentRulingDecision, icon } = props
  const { formatMessage } = useIntl()
  const [verdictViewDate, setVerdictViewDate] = useState<Date>()
  const [appealDate, setAppealDate] = useState<Date>()
  const [textItems, setTextItems] = useState<string[]>([])
  const [triggerAppealAnimation, setTriggerAppealAnimation] =
    useState<boolean>(false)
  const [triggerAnimation, setTriggerAnimation] = useState<boolean>(false)
  const { setAndSendDefendantToServer } = useDefendants()
  const { workingCase, setWorkingCase } = useContext(FormContext)

  // The defendant can appeal if the verdict has been served to them or if the cases
  // ruling is a FINE because in those cases a verdict is not served to the defendant
  const defendantCanAppeal =
    indictmentRulingDecision === CaseIndictmentRulingDecision.FINE ||
    defendant.verdictViewDate

  const showAppealFields =
    Boolean(defendant.verdictViewDate) ||
    indictmentRulingDecision === CaseIndictmentRulingDecision.FINE

  const handleDateChange = (
    date: Date | undefined,
    valid: boolean,
    dateType: DateType,
  ) => {
    if (!date) {
      // Do nothing
      return
    }

    if (!valid) {
      toast.error(formatMessage(errors.createIndictmentCount))
    }

    dateType === 'verdictViewDate'
      ? setVerdictViewDate(date)
      : setAppealDate(date)
  }

  const handleSetDate = (dateType: DateType) => {
    if (
      (dateType === 'verdictViewDate' && !verdictViewDate) ||
      (dateType === 'appealDate' && !appealDate)
    ) {
      toast.error(formatMessage(errors.invalidDate))
      return
    }

    if (dateType === 'verdictViewDate' && verdictViewDate) {
      setAndSendDefendantToServer(
        {
          caseId: workingCase.id,
          defendantId: defendant.id,
          verdictViewDate: formatDateForServer(verdictViewDate),
        },
        setWorkingCase,
      )
    } else if (dateType === 'appealDate' && appealDate) {
      setTriggerAppealAnimation(true)
      setTimeout(() => {
        setAndSendDefendantToServer(
          {
            caseId: workingCase.id,
            defendantId: defendant.id,
            verdictAppealDate: formatDateForServer(appealDate),
          },
          setWorkingCase,
        )
      }, 400)
    } else {
      toast.error(formatMessage(errors.general))
    }
  }

  const datePickerVariants = {
    dpHidden: { opacity: 0, y: 15 },
    dpVisible: { opacity: 1, y: 0 },
    dpExit: {
      opacity: 0,
      y: 15,
    },
  }

  const datePicker2Variants = {
    dpHidden: { opacity: 0, y: 15 },
    dpVisible: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: { delay: triggerAnimation ? 0 : 0.4 },
    },
    dpExit: {
      opacity: 0,
      height: 0,
      transition: { height: { delay: 0.4 } },
    },
  }

  useEffect(() => {
    const verdictAppealDeadline = defendant.verdictAppealDeadline
      ? defendant.verdictAppealDeadline
      : verdictViewDate
      ? addDays(new Date(verdictViewDate), 28).toISOString()
      : null

    const appealExpiration = getAppealExpirationInfo(verdictAppealDeadline)

    setTextItems([
      ...(indictmentRulingDecision === CaseIndictmentRulingDecision.RULING
        ? [
            formatMessage(strings.defendantVerdictViewedDate, {
              date: verdictViewDate
                ? formatDate(verdictViewDate)
                : formatDate(defendant.verdictViewDate),
            }),
          ]
        : []),
      formatMessage(appealExpiration.message, {
        appealExpirationDate: appealExpiration.date,
      }),
      ...(defendant.verdictAppealDate
        ? [
            formatMessage(strings.defendantAppealDate, {
              date: formatDate(defendant.verdictAppealDate),
            }),
          ]
        : []),
    ])
  }, [
    defendant.verdictAppealDate,
    defendant.verdictAppealDeadline,
    defendant.verdictViewDate,
    formatMessage,
    indictmentRulingDecision,
    verdictViewDate,
  ])

  return (
    <Box className={styles.container} padding={[2, 2, 3, 3]}>
      <Box className={styles.titleContainer}>
        <SectionHeading
          title="Lykildagsetningar"
          heading="h4"
          marginBottom={2}
        />
        {icon && (
          <Icon icon={icon} type="outline" color="blue400" size="large" />
        )}
        <Box marginBottom={1}>
          <Text variant="eyebrow">{defendant.name}</Text>
        </Box>
      </Box>
      <AnimatePresence>
        {showAppealFields &&
          textItems.map((text, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.2, duration: 0.3 }}
              style={{
                marginTop: index === 0 ? 0 : '16px',
              }}
              onAnimationComplete={() => setTriggerAnimation(true)}
            >
              <Text>{text}</Text>
            </motion.div>
          ))}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {defendant.verdictAppealDate ? null : defendantCanAppeal ? (
          <motion.div
            key="defendantAppealDate"
            variants={datePicker2Variants}
            initial="dpHidden"
            animate="dpVisible"
            exit="dpExit"
            style={{ marginTop: '16px' }}
          >
            <Box className={styles.dataContainer}>
              <DateTime
                name="defendantAppealDate"
                datepickerLabel={formatMessage(
                  strings.defendantAppealDateLabel,
                )}
                datepickerPlaceholder={formatMessage(
                  strings.defendantAppealDatePlaceholder,
                )}
                size="sm"
                onChange={(date, valid) =>
                  handleDateChange(date, valid, 'appealDate')
                }
                blueBox={false}
                dateOnly
              />
              <Button
                onClick={() => handleSetDate('appealDate')}
                disabled={!appealDate}
              >
                {formatMessage(strings.defendantAppealDateButtonText)}
              </Button>
            </Box>
          </motion.div>
        ) : (
          <motion.div
            key="defendantVerdictViewDate"
            variants={datePickerVariants}
            initial={false}
            animate="dpVisible"
            exit="dpExit"
            transition={{ duration: 0.2, ease: 'easeInOut', delay: 0.4 }}
            style={{ marginTop: '16px' }}
          >
            <Box className={styles.dataContainer}>
              <DateTime
                name="defendantVerdictViewDate"
                datepickerLabel={formatMessage(
                  strings.defendantVerdictViewDateLabel,
                )}
                datepickerPlaceholder={formatMessage(
                  strings.defendantVerdictViewDatePlaceholder,
                )}
                size="sm"
                selectedDate={verdictViewDate}
                onChange={(date, valid) =>
                  handleDateChange(date, valid, 'verdictViewDate')
                }
                blueBox={false}
                dateOnly
              />
              <Button
                onClick={() => handleSetDate('verdictViewDate')}
                disabled={!verdictViewDate}
              >
                {formatMessage(strings.defendantVerdictViewDateButtonText)}
              </Button>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}

export default BlueBoxWithDate
