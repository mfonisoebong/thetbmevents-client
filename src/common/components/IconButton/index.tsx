import { iconVariants } from "@common/constants/iconVariants";
import { IconButtonProps } from "@common/typings";
import { FC } from "react";
import { twMerge } from "tailwind-merge";
import Loader from "@common/components/Icons/Loader";

const IconButton: FC<IconButtonProps> = ({
  variant = "fill",
  className,
  loading,
  disabled,
  icon,
  children,

  ...restProps
}) => {
  const buttonClass = twMerge(
    iconVariants[variant],
    "flex items-center space-x-2 active:scale-90",
    className,
  );

  return (
    <button
      disabled={loading ?? disabled}
      className={buttonClass}
      {...restProps}
    >
      {loading ? <Loader color={"black"} size={17} /> : icon}
      <span>{children}</span>
    </button>
  );
};

export default IconButton;
