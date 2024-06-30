import { iconSizes } from "@common/constants/iconSizes";
import { IconProps } from "@common/typings";
import { FC } from "react";

const Pencil: FC<IconProps> = (props) => {
  const { color, size = 19, ...restProps } = props;

  const iconSize = typeof size === "string" ? iconSizes[size] : size;

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 512 512"
      xmlns="http://www.w3.org/2000/svg"
      {...restProps}
    >
      <path
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="32"
        d="M364.13 125.25L87 403l-23 45 44.99-23 277.76-277.13-22.62-22.62zM420.69 68.69l-22.62 22.62 22.62 22.63 22.62-22.63a16 16 0 000-22.62h0a16 16 0 00-22.62 0z"
      />
    </svg>
  );
};

export default Pencil;
