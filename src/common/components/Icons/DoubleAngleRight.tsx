import { iconSizes } from "@common/constants/iconSizes";
import { IconProps } from "@common/typings";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

const DoubleAngleRight: FC<IconProps> = (props) => {
  const { color, size = 19, className, ...restProps } = props;

  const iconSize = typeof size === "string" ? iconSizes[size] : size;
  const c = twMerge("scale-150", className);

  return (
    <svg
      viewBox="0 0 32 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      width={iconSize}
      height={iconSize}
      {...restProps}
      className={c}
    >
      <path
        d="M8.97051 19.9334L15.9996 13.0368L9.10307 6.00769"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.9702 19.9905L21.9994 13.0939L15.1028 6.0648"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default DoubleAngleRight;
