import { useContext } from "react"
import { SlidersContext } from "../contexts/SlidersContext/Context"

export default function useSlidersContext() {
  return useContext(SlidersContext)
}
