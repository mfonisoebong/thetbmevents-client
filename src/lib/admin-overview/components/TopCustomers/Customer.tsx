import { FC } from "react"
import { CustomerProps } from "@lib/admin-overview/typings"
import { numberFormatter } from "@common/utils/numberFormatter"
import Avatar from "@common/components/Avatar"

const Customer: FC<CustomerProps> = ({ email, name, avatar, totalTicket }) => {
  return (
    <div className={"flex items-center justify-between"}>
      <div className={"flex items-center space-x-3"}>
        <Avatar
          image={avatar ?? "/images/avatar.svg"}
          size={60}
          className={"object-cover w-16"}
        />
        <div>
          <h6 className={"font-bold text-sm md:text-base"}>{name}</h6>
          <p className="font-normal text-xs md:text-sm">{email}</p>
        </div>
      </div>
      {totalTicket && (
        <div>
          <p className="font-semibold text-xs md:text-lg uppercase">
            {numberFormatter(totalTicket, 0)} tickets
          </p>
        </div>
      )}
    </div>
  )
}

export default Customer
