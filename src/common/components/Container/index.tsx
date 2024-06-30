import { ContainerProps } from "@common/typings";
import { FC } from "react";
import { twMerge } from "tailwind-merge";

const Container: FC<ContainerProps> = (props) => {
  const { className, ...restProps } = props;

  const c = twMerge("mx-auto px-4 lg:px-0 container", className);

  return <div className={c} {...restProps} />;
};

export default Container;
