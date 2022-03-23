import { Ref } from 'vue'
import XLSX, { WorkBook, WorkSheet } from 'xlsx'

export interface Sheet {
  headers: string[];
  headers1: string[];
  rowData: any[];
  columns: { [key: string]: any[] };
  columns1: { [key: string]: any[] };
}

export const importExcelSheet = (file: File, receiver: Ref<Sheet | undefined>, sheetIndex: number): void => {
  if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    file.type === 'application/vnd.ms-excel') {
    readExcelFile(file, receiver, sheetIndex)
  }
}

const readExcelFile = (file: File, receiver: Ref<Sheet | undefined>, sheetIndex: number) => {
  let binaryString = ''
  const reader = new FileReader()
  reader.onload = (ev: ProgressEvent<FileReader>) => {
    // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
    const bytes = reader.result && typeof reader.result !== 'string' ? new Uint8Array(reader.result) : null
    if (bytes) {
      const length = bytes.byteLength
      for (let i = 0; i < length; i++) {
        binaryString += String.fromCharCode(bytes[i])
      }
      const wb: WorkBook = XLSX.read(binaryString, {
        type: 'binary'
      })
      const sheet: WorkSheet = wb.Sheets[wb.SheetNames[sheetIndex]]
      const rowData = XLSX.utils.sheet_to_json(sheet)
      const headers = getHeaders(rowData)
      const headers1 = JSON.parse(JSON.stringify(headers)).splice(1, headers.length)
      const columns = getColumns(headers, rowData)
      const columns1 = getColumns1(headers, rowData)
      receiver.value = {
        headers,
        headers1,
        rowData,
        columns,
        columns1
      }
    }
  }
  reader.readAsArrayBuffer(file)
}

const getHeaders = (rowData: any[]): string[] => {
  let headers: string[] = []
  if (rowData.length > 0) {
    const headerRow = rowData[0]
    headers = Object.keys(headerRow).filter(key => key.substring(key.length - 2, key.length) !== '_1')
  }
  return headers
}

const getColumns = (headers: string[] = [], rowData: any[] = []): { [key: string]: any[] } => {
  const columns: { [key: string]: any[] } = {}
  if (headers.length > 0 && rowData.length > 0) {
    for (let i = 0; i < headers.length; i++) {
      const column = []
      const header = headers[i]
      for (let j = 0; j < rowData.length; j++) {
        const row = rowData[j]
        column.push(row[header])
      }
      columns[header] = column
    }
  }
  return columns
}

const getColumns1 = (headers: string[] = [], rowData: any[] = []): { [key: string]: any[] } => {
  const columns: { [key: string]: any[] } = {}
  if (headers.length > 0 && rowData.length > 0) {
    const headers1 = JSON.parse(JSON.stringify(headers)).splice(1, headers.length)
    const header0: string = JSON.parse(JSON.stringify(headers)).splice(0, 1)[0]
    for (let i = 0; i < headers1.length; i++) {
      const column = []
      const header = headers1[i]
      for (let j = 0; j < rowData.length; j++) {
        const row = rowData[j]
        column.push([row[header0], row[header]])
      }
      columns[header] = column
    }
  }
  return columns
}
