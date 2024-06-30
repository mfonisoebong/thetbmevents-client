import { NoContentProps } from "@common/typings"
import Image from "next/image"
import { FC } from "react"
import styles from "./styles.module.css"
import Button from "../Button"
import ButtonLink from "../ButtonLink"

const DEFAULT_IMAGE = "/images/not-found.svg"
const NoContent: FC<NoContentProps> = ({
  title,
  button,
  image = DEFAULT_IMAGE,
  children,
}) => {
  return (
    <div className={styles.nocontent}>
      <div>
        <Image src={image} alt="Not found" width={180} height={180} />
      </div>
      <h3>{title}</h3>
      {children}
      {button?.action && (
        <Button
          onClick={button.action}
          className={styles.button}
          variant={button.variant}
          size="lg"
        >
          {button.text}
        </Button>
      )}
      {button?.link && (
        <ButtonLink
          href={button.link}
          className={styles.button}
          variant={button.variant}
          size="lg"
        >
          {button.text}
        </ButtonLink>
      )}
    </div>
  )
}

export default NoContent
