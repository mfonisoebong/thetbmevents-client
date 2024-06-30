import {
  AllStrings,
  IndividualUser,
  OrganizerUser,
  SameType,
} from "@common/typings"
import { BankDetails } from "@lib/dashboard-profile/typings"

export interface IndividualFormProps {
  user: IndividualUser
}

export interface OrganizerFormProps {
  user: OrganizerUser
}

export interface AvatarActionsProps {
  onChange: () => void
  upload: () => void
  saveDisabled?: boolean
  remove: () => void
}

export interface BankDetailsFormProps {
  bankDetails: BankDetails
}

export type Bank = SameType<"code" | "name" | "logo", string>
