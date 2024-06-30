import { PropsWithChildren } from "react"

export interface BankDetailsData {
  bank_name: string
  account_number: string
  account_name: string
  swift_code?: string
  iban?: string
}
export type BankDetails = BankDetailsData | null

export interface InfoContainerProps extends PropsWithChildren {
  title: string
  editLink: string
  withBorder?: boolean
}

export interface InfoProps {
  title: string
  value?: string
}
