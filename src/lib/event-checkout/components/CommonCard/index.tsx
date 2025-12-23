import { FC } from "react";
import { CommonCardProps } from "@lib/event-checkout/typings";
import styles from "./styles.module.css";

const CommonCard: FC<CommonCardProps> = ({ children, title, desc }) => {
  return (
    <div>
      <div className={styles.title}>{title}</div>
        {desc && <div className={styles.desc}>{desc}</div>}
      {children}
    </div>
  );
};

export default CommonCard;
