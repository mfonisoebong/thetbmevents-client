import { LinkListProps } from "@common/typings"
import { FC } from "react"
import styles from "../styles.module.css"
import Link from "next/link"

const LinkList: FC<LinkListProps> = (props) => {
  return (
    <ul className="space-y-4 px-8 py-6 md:py-0">
      {props.links.map((l) => (
        <Link
          key={l.text}
          className={
            props.uppercase ? styles.footerlinkupper : styles.footerlink
          }
          href={l.link}
        >
          {l.text}
        </Link>
      ))}
    </ul>
  )
}

export default LinkList
