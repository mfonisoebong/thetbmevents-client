import { FC } from "react";
import OverviewCard from "@lib/admin-dashboard/components/OverviewCard";
import CardHeader from "@lib/admin-overview/components/RevenueEventOverview/CardHeader";
import styles from "../styles.module.css";
import Select from "@lib/admin-dashboard/components/Select";
import {
  MONTHS,
  MONTHS_INDEX,
  MONTHS_MAP,
} from "@lib/admin-dashboard/constants/months";
import { useRouter } from "next/router";
import useRevenueOverview from "@lib/admin-overview/hooks/useRevenueOverview";
import Card from "@lib/admin-overview/components/RevenueEventOverview/Revenue/Card";
import Loader from "@common/components/Icons/Loader";
const Revenue: FC = () => {
  const router = useRouter();
  const month = router.query?.revenue_overview_month as string;
  const parsedMonth = month ? Number(month) : 1;
  const selectedMonth = MONTHS_MAP[parsedMonth];
  const selectMonth = (month: number) => {
    router.push({
      query: {
        ...router.query,
        revenue_overview_month: month,
      },
    });
  };

  const { data: revenue, isLoading } = useRevenueOverview();

  return (
    <OverviewCard>
      <CardHeader title={"Revenue"} />
      <div className={styles.cardbody}>
        <Select
          options={MONTHS_INDEX}
          optionsDisplay={MONTHS}
          onSelect={selectMonth}
          selectedOption={selectedMonth}
        />
        {!revenue ? (
          <Loader color={"black"} size={60} className={"mx-auto"} />
        ) : (
          <>
            <Card title={"Net revenue"} value={revenue.net_revenue} />
            <Card title={"Net commision"} value={revenue.net_commision} />
          </>
        )}
      </div>
    </OverviewCard>
  );
};

export default Revenue;
