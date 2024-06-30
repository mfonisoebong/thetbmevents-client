import { FC } from "react";
import styles from "./styles.module.css";
import OverviewData from "@lib/dashboard-finance/components/Overview/OverviewData";
import HighestSellingEvent from "@lib/dashboard-finance/components/Overview/HighestSellingEvent";
import useFinanceData from "@lib/dashboard-finance/hooks/useFinanceData";
const Overview: FC = () => {
  useFinanceData();
  return (
    <div className={styles.overview}>
      <OverviewData />
      <HighestSellingEvent />
    </div>
  );
};

export default Overview;
