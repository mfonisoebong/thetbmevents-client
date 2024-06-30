import { FC } from "react";
import OverviewCard from "../OverviewCard";
import { numberFormatter } from "@common/utils/numberFormatter";
import styles from "./styles.module.css";
import useOverview from "@lib/dashboard-overview/hooks/useOverview";

const Profit: FC = () => {
  const { data: overview } = useOverview();

  if (!overview) return null;

  return (
    <OverviewCard
      className="w-full md:w-4/12 lg:w-5/12"
      title="Profit"
      theme="light"
    >
      <div className="mt-5 h-36 lg:h-40 ">
        <h3 className={styles.blocktext}>
          &#8358;{numberFormatter(overview?.commision_and_profit.profit)}
        </h3>
      </div>
    </OverviewCard>
  );
};

export default Profit;
