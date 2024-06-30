import { iconSizes } from "@common/constants/iconSizes"
import { IconProps } from "@common/typings"
import { FC } from "react"

const ArrowRight: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props

  const iconSize = typeof size === "string" ? iconSizes[size] : size

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 42 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        d="M33.1154 21.0001L5.42311 21.0001"
        stroke={color}
        strokeWidth="2.51899"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.7308 10.6156L34.5038 20.2912C34.6114 20.3798 34.6976 20.4888 34.7566 20.6109C34.8157 20.7329 34.8462 20.8653 34.8462 20.9993C34.8462 21.1332 34.8157 21.2656 34.7566 21.3877C34.6976 21.5098 34.6114 21.6187 34.5038 21.7073L22.7308 31.3848"
        stroke={color}
        strokeWidth="2.51899"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowRight
