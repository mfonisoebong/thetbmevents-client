import { iconSizes } from "@common/constants/iconSizes";
import { IconProps } from "@common/typings";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
const DoubleAngleLeft: FC<IconProps> = (props) => {
  const { color, size = 19, className, ...restProps } = props;

  const iconSize = typeof size === "string" ? iconSizes[size] : size;

  const c = twMerge("scale-150", className);

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 29 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
      className={c}
    >
      <path
        d="M20.9632 5L14 11.9632L20.9632 18.9263"
        stroke="#14142B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.9632 5L9 11.9632L15.9632 18.9263"
        stroke="#14142B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DoubleAngleLeft;
