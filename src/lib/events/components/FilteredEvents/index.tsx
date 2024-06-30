import { FC } from "react"
import Section from "../Section"
import useFilteredEvents from "@lib/events/hooks/useFilteredEvents"
import NoContent from "@common/components/NoContent"
import GoBack from "./GoBack"
import { useRouter } from "next/router"
import Events from "./Events"
import Controls from "./Controls"

const FilteredEvents: FC = () => {
  const { data: filtered } = useFilteredEvents()
  const router = useRouter()

  const resetFilter = () => {
    router.push(
      {
        query: null,
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      }
    )
  }
  if (filtered?.events?.length === 0) {
    return (
      <NoContent
        title="There’s no event that match this category"
        button={{
          text: "Go back",
          action: resetFilter,
        }}
      />
    )
  }

  return (
    <Section title="Results">
      <GoBack />
      <Events />
      <Controls />
    </Section>
  )
}

export default FilteredEvents
