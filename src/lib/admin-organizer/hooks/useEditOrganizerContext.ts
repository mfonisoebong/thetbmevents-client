import { useContext } from "react"
import { EditOrganizerContext } from "../contexts/EditOrganizer/Context"

export default function useEditOrganizerContext() {
  return useContext(EditOrganizerContext)
}
