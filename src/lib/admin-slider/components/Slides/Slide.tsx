import { SlideProps } from "@lib/admin-slider/typings"
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard"
import { FC } from "react"
import SelectEvent from "./SelectEvent"
import EventThumbnail from "./EventThumbnail"

const Slide: FC<SlideProps> = ({ index }) => {
  return (
    <div className="w-full lg:w-1/2">
      <OverviewCard title={`Slide ${index + 1}`} theme="light">
        <div className="mt-3 space-y-3">
          <SelectEvent index={index} />
          <EventThumbnail index={index} />
        </div>
      </OverviewCard>
    </div>
  )
}

export default Slide
