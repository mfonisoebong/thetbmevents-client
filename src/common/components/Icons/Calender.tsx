import { iconSizes } from "@common/constants/iconSizes"
import { IconProps } from "@common/typings"
import { FC } from "react"

const Calender: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props

  const iconSize = typeof size === "string" ? iconSizes[size] : size

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 22 26"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M19.8 2.36364H18.7V0H16.5V2.36364H5.5V0H3.3V2.36364H2.2C0.99 2.36364 0 3.42727 0 4.72727V23.6364C0 24.9364 0.99 26 2.2 26H19.8C21.01 26 22 24.9364 22 23.6364V4.72727C22 3.42727 21.01 2.36364 19.8 2.36364ZM19.8 23.6364H2.2V8.27273H19.8V23.6364Z"
        fill={color}
      />
    </svg>
  )
}

export default Calender
