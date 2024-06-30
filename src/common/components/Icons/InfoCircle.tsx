import { iconSizes } from "@common/constants/iconSizes"
import { IconProps } from "@common/typings"
import { FC } from "react"

const InfoCircle: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props

  const iconSize = typeof size === "string" ? iconSizes[size] : size

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={iconSize}
      height={iconSize}
      {...restProps}
    >
      <path
        d="M248 64C146.39 64 64 146.39 64 248s82.39 184 184 184 184-82.39 184-184S349.61 64 248 64z"
        fill="none"
        stroke={color}
        strokeMiterlimit="10"
        strokeWidth="32"
      />
      <path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M220 220h32v116"
      />
      <path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeMiterlimit="10"
        strokeWidth="32"
        d="M208 340h88"
      />
      <path fill={color} d="M248 130a26 26 0 1026 26 26 26 0 00-26-26z" />
    </svg>
  )
}

export default InfoCircle
