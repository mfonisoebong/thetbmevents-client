import { UserAccountState } from "@common/typings"
import { ChangeEvent, HTMLInputTypeAttribute } from "react"

export interface Organizer {
  name: string
  id: string
  email: string
  avatar?: string
  phone: string
  created_at: string
  role: "organizer"
  account_status: UserAccountState
  bank_details?: Bankdetails
  commision?: Commision
}

export interface Commision {
  rate: number
}

export interface Bankdetails {
  id: string
  user_id: string
  bank_name: string
  account_number: string
  swift_code?: string
  account_name: string
  iban?: string
}

export interface DetailCardProps {
  title: string
  value: string
  inputValue?: string | number
  editable?: boolean
  inputType?: HTMLInputTypeAttribute
  onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

export interface OrganizerEdit {
  commision?: number
  swiftCode?: string
  iban?: string
}

export interface EditOrganizerContextValues {
  organizerEdit: OrganizerEdit
  notEdited: boolean
  handleOrganizerEdit: <T extends keyof OrganizerEdit>(
    name: T,
    value: OrganizerEdit[T]
  ) => void
}
