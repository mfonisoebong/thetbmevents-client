import { FC } from "react";
import OverviewCard from "../OverviewCard";
import styles from "./styles.module.css";
import { numberFormatter } from "@common/utils/numberFormatter";
import Earnings from "./Earnings";
import useOverview from "@lib/dashboard-overview/hooks/useOverview";

const EventsStats: FC = () => {
  const { data: overview, isLoading } = useOverview();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-4 lg:gap-6">
      <OverviewCard theme="black" title="Events created">
        <div className={styles.numberbody}>
          <h3 className={styles.lighttext}>
            {typeof overview?.events === "number" ? overview.events : "----"}
          </h3>
        </div>
      </OverviewCard>
      <OverviewCard theme="light" title="Tickets Sold">
        <div className={styles.numberbody}>
          <h3 className={styles.darktext}>
            {typeof overview?.tickets_sold === "number"
              ? overview.tickets_sold
              : "-----"}
          </h3>
        </div>
      </OverviewCard>
      <OverviewCard theme="black" title="Earnings">
        <Earnings />
      </OverviewCard>
    </div>
  );
};

export default EventsStats;
