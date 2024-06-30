import { FC, PropsWithChildren } from "react";
import styles from "./styles.module.css";
const OverviewCard: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.card}>{children}</div>;
};

export default OverviewCard;
