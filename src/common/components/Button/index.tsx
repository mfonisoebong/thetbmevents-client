import { buttonVariants, sizesVariants } from "@common/constants/buttonVariants"
import { ButtonProps } from "@common/typings"
import { FC } from "react"
import { twMerge } from "tailwind-merge"
import styles from "./styles.module.css"
import Loader from "../Icons/Loader"

const Button: FC<ButtonProps> = ({
  variant = "primary",
  size,
  className,
  loading,
  disabled,
  children,
  ...restProps
}) => {
  const sizeClassName = size ? sizesVariants[size] : "px-6 py-3"
  const buttonClassName = twMerge(
    styles.button,
    buttonVariants[variant],
    sizeClassName,
    className
  )
  const iconColor = variant === "primary" ? "white" : "black"

  return (
    <button
      disabled={loading ? loading : disabled}
      {...restProps}
      className={buttonClassName}
    >
      {loading ? <Loader color={iconColor} /> : children}
    </button>
  )
}

export default Button
