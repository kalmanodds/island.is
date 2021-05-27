import { UploadFile } from '@island.is/island-ui/core'

import { S3UploadResponse, ActionTypes, Action } from './types'

export const uploadFileToS3 = (
  file: UploadFile,
  dispatch: React.Dispatch<Action>,
  uploadUrl: string,
  fields: Record<string, any>,
): Promise<S3UploadResponse> => {
  return new Promise<S3UploadResponse>((resolve, reject) => {
    const req = new XMLHttpRequest()

    const onError = () => {
      dispatch({
        type: ActionTypes.UPDATE,
        payload: { file, status: 'error', percent: 0 },
      })
      reject(req.response)
    }

    req.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)

        dispatch({
          type: ActionTypes.UPDATE,
          payload: { file, status: 'uploading', percent },
        })
      }
    })

    req.onload = () => {
      if (req.status !== 200 && req.status !== 204) {
        onError()
        return
      }

      dispatch({
        type: ActionTypes.UPDATE,
        payload: { file, status: 'done', percent: 100 },
      })

      resolve({ url: uploadUrl })
    }

    req.addEventListener('error', onError)
    req.upload.addEventListener('error', onError)

    const form = new FormData()

    Object.keys(fields).forEach((key) => form.append(key, fields[key]))

    if (file.originalFileObj) {
      form.append('file', file.originalFileObj)
    }

    req.open('POST', uploadUrl, true)
    req.send(form)
  })
}
