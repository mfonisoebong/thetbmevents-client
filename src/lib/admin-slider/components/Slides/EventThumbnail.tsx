import { FC } from "react"
import { SlideProps } from "@lib/admin-slider/typings"
import useSlidersContext from "@lib/admin-slider/hooks/useSlidersContext"
import useEvents from "@lib/admin-slider/hooks/useEvents"
import Image from "next/image"
import styles from "./styles.module.css"
import NoThumbnail from "./NoThumbnail"

const EventThumbnail: FC<SlideProps> = ({ index }) => {
  const { slides } = useSlidersContext()
  const { data: events } = useEvents()

  const slide = slides[index]

  const event = events?.find((e) => e.id === slide?.eventId)
  const logo = event?.logo

  return (
    <div className="space-y-2">
      <p>Event Thumbnail</p>

      {logo ? (
        <Image
          src={logo}
          alt={event.title ?? ""}
          width={300}
          height={150}
          unoptimized
          className={styles.thumbnail}
        />
      ) : (
        <NoThumbnail />
      )}
    </div>
  )
}

export default EventThumbnail
