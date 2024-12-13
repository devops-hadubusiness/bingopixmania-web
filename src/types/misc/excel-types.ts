export type ExportExcelFieldsProps = {
  [title: string]: ExportExcelFieldProps | string
}

export type ExportExcelFieldProps = {
  field?: string
  callback?: Function
}
