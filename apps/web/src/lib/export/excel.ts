import * as XLSX from 'xlsx'

export function downloadExcel<T extends Record<string, unknown>>(params: {
  filename: string
  sheetName: string
  rows: T[]
}) {
  const ws = XLSX.utils.json_to_sheet(params.rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, params.sheetName)
  XLSX.writeFile(wb, params.filename)
}

