import { ButtonSizeVariants, ButtonVariants } from "@common/typings";

export const buttonVariants: ButtonVariants = {
  primary: "bg-main text-white disabled:bg-gray-500",
  secondaryAlt: "bg-mainBlue text-white disabled:bg-gray-500",
  secondary:
    "border-[0.1rem] border-solid border-mainBlue text-main disabled:opacity-70",
  outline:
    "border-[0.1rem] border-solid border-main text-mainDark disabled:opacity-70  hover:bg-main hover:text-white duration-200",
  regular: "flex space-x-2 items-center text-main",
  altPrimary: "bg-white text-main",
};

export const sizesVariants: ButtonSizeVariants = {
  sm: "text-sm py-2 px-3",
  lg: "py-4 px-6",
};
