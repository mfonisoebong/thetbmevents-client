import { SlideProps } from "@lib/admin-slider/typings"
import { FC } from "react"
import Select from "@lib/admin-dashboard/components/Select"
import styles from "./styles.module.css"
import useEvents from "@lib/admin-slider/hooks/useEvents"
import useSlidersContext from "@lib/admin-slider/hooks/useSlidersContext"

const SelectEvent: FC<SlideProps> = ({ index }) => {
  const { data: events } = useEvents()
  const { slides, editSlides } = useSlidersContext()
  if (!events) return null

  const selectedEventIds = slides.map((e) => e.eventId)
  const filteredEvents = events.filter((e) => !selectedEventIds.includes(e.id))
  const eventsIds = filteredEvents.map((e) => e.id)
  const eventTitles = filteredEvents.map((e) => e.title)
  const selectedEvent = events.find((e) => e.id === slides[index]?.eventId)
  const onSelect = (id: string) => {
    editSlides(index, id)
  }

  return (
    <div className="space-y-2">
      <p>Select Event</p>
      <Select
        selectedOption={selectedEvent?.title ?? undefined}
        className={styles.selectevents}
        options={eventsIds}
        optionsDisplay={eventTitles}
        onSelect={onSelect}
      />
    </div>
  )
}

export default SelectEvent
