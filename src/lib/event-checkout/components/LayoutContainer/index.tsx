import { FC } from "react";
import { LayoutContainerProps } from "@lib/event-checkout/typings";
import styles from "./styles.module.css";
import { twMerge } from "tailwind-merge";

const LayoutContainer: FC<LayoutContainerProps> = ({
  title,
  children,
  className,
}) => {
  const c = twMerge(styles.layoutcontainer, className);

  return (
    <div className={c}>
      <h2>{title}</h2>

      {children}
    </div>
  );
};

export default LayoutContainer;
