import { FC } from "react";
import OverviewCard from "../OverviewCard";
import { numberFormatter } from "@common/utils/numberFormatter";
import styles from "./styles.module.css";
import useOverview from "@lib/dashboard-overview/hooks/useOverview";

const Commissions: FC = () => {
  const { data: overview } = useOverview();

  if (!overview) return null;

  return (
    <OverviewCard className="w-full md:w-8/12 lg:w-7/12" theme="light">
      <div className="h-36 lg:h-40">
        <div className={styles.commisionheading}>
          <div className="space-y-5">
            <h6 className={styles.cardtitle}>Total Commissions </h6>
            <h3 className={styles.blocktext}>
              &#8358;{numberFormatter(overview?.commision_and_profit.commision)}
            </h3>
          </div>
          <div className="space-y-5">
            <h6 className={styles.cardtitle}>Commission Rate </h6>
            <h3 className={styles.blocktext}>
              {overview?.commision_and_profit.rate}%
            </h3>
          </div>
        </div>
      </div>
    </OverviewCard>
  );
};

export default Commissions;
