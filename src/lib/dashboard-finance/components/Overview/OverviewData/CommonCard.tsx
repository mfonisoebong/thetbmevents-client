import { FC } from "react";
import { CommonCardProps } from "@lib/dashboard-finance/typings";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import styles from "@lib/dashboard-finance/components/Overview/styles.module.css";

const CommonCard: FC<CommonCardProps> = ({ body, title, theme }) => {
  return (
    <OverviewCard theme={theme}>
      <div className={styles.common}>
        <h5>{title}</h5>
        <h2>{body}</h2>
      </div>
    </OverviewCard>
  );
};

export default CommonCard;
