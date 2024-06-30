import { buttonVariants, sizesVariants } from "@common/constants/buttonVariants"
import { ButtonLinkProps } from "@common/typings"
import Link from "next/link"
import styles from "../Button/styles.module.css"
import { FC } from "react"
import { twMerge } from "tailwind-merge"

const ButtonLink: FC<ButtonLinkProps> = (props) => {
  const { variant = "primary", size, className, ...restProps } = props
  const sizeClassName = size ? sizesVariants[size] : "px-6 py-3"
  const linkClassName = twMerge(
    styles.button,
    buttonVariants[variant],
    sizeClassName,
    className
  )

  return <Link className={linkClassName} {...restProps} />
}

export default ButtonLink
