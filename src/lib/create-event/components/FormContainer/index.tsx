import { FC, PropsWithChildren } from "react";
import { FormContainerProps } from "@lib/create-event/typings";
import { twMerge } from "tailwind-merge";

const FormContainer: FC<FormContainerProps> = (props) => {
  const c = twMerge(
    "grid grid-cols-1 lg:grid-cols-2 gap-y-3 md:gap-y-4 gap-x-0 lg:gap-x-12",
    props.className,
  );

  return <div className={c}>{props.children}</div>;
};

export default FormContainer;
