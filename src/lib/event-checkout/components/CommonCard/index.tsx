import { FC } from "react";
import { CommonCardProps } from "@lib/event-checkout/typings";
import styles from "./styles.module.css";

const CommonCard: FC<CommonCardProps> = ({ children, title }) => {
  return (
    <div>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
};

export default CommonCard;
