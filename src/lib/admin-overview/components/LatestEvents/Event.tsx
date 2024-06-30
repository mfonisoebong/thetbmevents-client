import { FC } from "react"
import { EventProps } from "@lib/admin-overview/typings"
import { numberFormatter } from "@common/utils/numberFormatter"
import { capitalizeFirstLetter } from "@common/utils/capitalizeFirstLetter"
import Avatar from "@common/components/Avatar"

const Event: FC<EventProps> = ({ title, type, ticketSold, logo }) => {
  return (
    <div className={"space-x-2 flex"}>
      <div className={"w-2/12"}>
        <Avatar image={logo} size={48} />
      </div>

      <div className={"w-9/12"}>
        <div className="flex justify-between text-xs md:text-sm">
          <h6 className={"font-bold"}>{title}</h6>
          <p>{numberFormatter(ticketSold, 0)} tickets</p>
        </div>
        <p className={"text-gray-500 text-xs md:text-sm"}>
          {capitalizeFirstLetter(type)}
        </p>
      </div>
    </div>
  )
}

export default Event
