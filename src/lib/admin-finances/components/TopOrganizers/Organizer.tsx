import { OrganizerProps } from "@lib/admin-finances/typings"
import { FC } from "react"
import styles from "./styles.module.css"
import Avatar from "@common/components/Avatar"
import ButtonLink from "@common/components/ButtonLink"

const Organizer: FC<OrganizerProps> = (props) => {
  return (
    <div className={styles.card}>
      <div className="flex space-x-2 items-center">
        <Avatar
          image={props.avatar ?? "/images/avatar.svg"}
          size={60}
          className={"object-cover w-16"}
        />
        <div className="text-white">
          <h6 className={"font-bold text-sm md:text-base"}>
            {props.organizer}
          </h6>
          <p className="font-normal text-xs md:text-sm">{props.email}</p>
        </div>
      </div>
      <ButtonLink
        size="sm"
        href={`/admin/organizers/${props.id}`}
        className="bg-white text-black text-xs md:text-sm"
      >
        View
      </ButtonLink>
    </div>
  )
}

export default Organizer
