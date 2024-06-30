import { TopEventProps } from "@lib/events/typings"
import Image from "next/image"
import { FC } from "react"
import defaultEventImg from "@common/images/defaultEvent.png"
import Link from "next/link"
import styles from "./styles.module.css"

const Event: FC<TopEventProps> = (props) => {
  return (
    <Link href={`/events/${props.id}`} className={styles.eventcardlink}>
      <Image
        src={{
          default: defaultEventImg,
          src: props.logo,
        }}
        width={350}
        height={550}
        alt={props.title}
      />
    </Link>
  )
}

export default Event
