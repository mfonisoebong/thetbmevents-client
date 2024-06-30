import { ChangeEvent } from "react"
import useEditOrganizerContext from "./useEditOrganizerContext"

export default function useEditOrganizer() {
  const { handleOrganizerEdit } = useEditOrganizerContext()

  const editSwiftCode = (e: ChangeEvent<HTMLInputElement>) => {
    handleOrganizerEdit("swiftCode", e.target.value.trim())
  }

  const editIban = (e: ChangeEvent<HTMLInputElement>) => {
    handleOrganizerEdit("iban", e.target.value.trim())
  }

  const editCommision = (e: ChangeEvent<HTMLInputElement>) => {
    handleOrganizerEdit("commision", e.target.valueAsNumber)
  }

  return {
    editSwiftCode,
    editIban,
    editCommision,
  }
}
