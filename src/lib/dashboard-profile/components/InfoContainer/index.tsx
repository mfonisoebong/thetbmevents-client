import { FC } from "react"
import styles from "./styles.module.css"
import ButtonLink from "@common/components/ButtonLink"
import { InfoContainerProps } from "@lib/dashboard-profile/typings"
import { twMerge } from "tailwind-merge"

const InfoContainer: FC<InfoContainerProps> = ({
  editLink,
  title,
  children,
  withBorder,
}) => {
  const c = twMerge(styles.infocontainer, withBorder ? styles.withborder : null)

  return (
    <div className={c}>
      <div className="flex items-center justify-between">
        <h3>{title} </h3>
        <ButtonLink href={editLink} variant={"outline"}>
          Edit
        </ButtonLink>
      </div>
      <div className={styles.information}>{children}</div>
    </div>
  )
}

export default InfoContainer
