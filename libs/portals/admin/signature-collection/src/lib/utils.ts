import { UploadFile, fileToObject } from '@island.is/island-ui/core'
import { uuid } from 'uuidv4'
import XLSX from 'xlsx'

export const pageSize = 10

export const countryAreas = [
  { value: 'Sunnlendingafjórðungur', label: 'Sunnlendingafjórðungur' },
  { value: 'Vestfirðingafjórðungur', label: 'Vestfirðingafjórðungur' },
  { value: 'Norðlendingafjórðungur', label: 'Norðlendingafjórðungur' },
  { value: 'Austfirðingafjórðungur', label: 'Austfirðingafjórðungur' },
]

export const signeeTypes = [
  { value: 'paper', label: 'Af blaði' },
  { value: 'digital', label: 'Rafræn' },
]

export type FiltersOverview = {
  area: Array<string>
  candidate: Array<string>
  input: string
}

export type FiltersSigneeType = {
  signeeType: Array<string>
  pageNumber: Array<string>
}

export enum ListStatus {
  Active = 'Active',
  InReview = 'InReview',
  Reviewed = 'Reviewed',
  Extendable = 'Extendable',
  Inactive = 'Inactive',
}

export enum CollectionStatus {
  InitialActive = 'InitialActive',
  Active = 'Active',
  InInitialReview = 'InInitialReview',
  InReview = 'InReview',
  Processing = 'Processing',
  Processed = 'Processed',
  Inactive = 'Inactive',
}

export const downloadFile = () => {
  const name = 'meðmæli.xlsx'
  const sheetData = [['Kennitala', 'Bls'], []]

  const getFile = (name: string, output: string | undefined) => {
    const uri =
      'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,'
    const encodedUri = encodeURI(`${uri}${output}`)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', name)
    document.body.appendChild(link)

    link.click()
  }

  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData)
  const workbook: XLSX.WorkBook = {
    Sheets: { [name]: worksheet },
    SheetNames: [name],
  }

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'base64',
  })
  getFile(name, excelBuffer)
}

// Bulk upload and compare
export const createFileList = (files: File[], fileList: UploadFile[]) => {
  const uploadFiles = files.map((file) => fileToObject(file))
  const uploadFilesWithKey = uploadFiles.map((f) => ({
    ...f,
    key: uuid(),
  }))
  return [...fileList, ...uploadFilesWithKey]
}

export const getFileData = async (newFile: File[]) => {
  const buffer = await newFile[0].arrayBuffer()
  const file = XLSX.read(buffer, { type: 'buffer' })

  const data = [] as any
  const sheets = file.SheetNames

  for (let i = 0; i < sheets.length; i++) {
    const temp = XLSX.utils.sheet_to_json(file.Sheets[file.SheetNames[i]])
    temp.forEach((res) => {
      data.push(res)
    })
  }

  return data
}
