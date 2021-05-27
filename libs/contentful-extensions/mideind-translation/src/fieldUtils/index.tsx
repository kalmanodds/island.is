import { translateTexts } from '../api/index'

// Widget operations
import richTextEditor from './widgets/richTextEditor'
import singleLine from './widgets/singleLine'
import multipleLine from './widgets/multipleLine'

interface WidgetActions {
  extractText: (value: any) => string[]
  createValue: (translation: string[], scaffold?: any) => any
  ignore?: boolean
}

function isFieldOk(field: any) {
  // Are there two locales?
  // Are they correct?
  if (!field.locales) {
    return false
  }
  if (!field.locales.includes('en') || !field.locales.includes('is-IS')) {
    return false
  }

  return true
}

function extractField(field: any, eInterface: any, locale = 'is-IS') {
  if (isFieldOk(field)) {
    const { widgetId } = eInterface.controls.filter(
      (a: any) => a['fieldId'] === field.id,
    )[0]

    // Logs to see the different widget types - useful for development
    // console.log("FIELD ID", field.id)
    // console.log("WIDGET-ID", widgetId)

    const { extractText, ignore } = selectWidget(widgetId)
    // ignore: Either not implemented or type not supported
    if (ignore) {
      return
    } else {
      var fieldValue = field.getValue(locale)
      if (fieldValue) {
        const texts = extractText(fieldValue)
        return texts
      } else {
        return []
      }
    }
  }
}

async function populateField(field: any, eInterface: any, texts: string[]) {
  if (isFieldOk(field)) {
    const { widgetId } = eInterface.controls.filter(
      (a: any) => a['fieldId'] === field.id,
    )[0]
    const { extractText, createValue, ignore } = selectWidget(widgetId)
    // ignore: Either not implemented or type not supported
    if (ignore) {
      return
    } else {
      // We still need to get the iceValue for those
      // widgets that rely on a scaffold (see RichText)
      var iceValue = field.getValue('is-IS')
      if (!iceValue) {
        return
      }
      const enValue = createValue(texts, iceValue)

      // Set the value in contentful
      field.setValue(enValue, 'en')
    }
  }
}

// Returns the widgetObject related to the widgetType
// Every widgetObject has an 'extractText' and 'createValue' function
function selectWidget(widgetId: string): WidgetActions | any {
  switch (widgetId) {
    case 'richTextEditor':
      return richTextEditor
    case 'singleLine':
      return singleLine
    case 'multipleLine':
      return multipleLine
    default:
      return {
        ignore: true,
      }
  }
}

export { extractField, populateField }
