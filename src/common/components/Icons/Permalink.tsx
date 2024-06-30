import { iconSizes } from "@common/constants/iconSizes";
import { IconProps } from "@common/typings";
import { FC } from "react";

const Permalink: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props;

  const iconSize = typeof size === "string" ? iconSizes[size] : size;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      width={iconSize}
      height={iconSize}
      {...restProps}
    >
      <path
        d="M200.66 352H144a96 96 0 010-192h55.41M312.59 160H368a96 96 0 010 192h-56.66M169.07 256h175.86"
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="48"
      />
    </svg>
  );
};

export default Permalink;
