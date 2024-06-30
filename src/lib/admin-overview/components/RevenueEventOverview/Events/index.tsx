import { FC } from "react";
import CardHeader from "@lib/admin-overview/components/RevenueEventOverview/CardHeader";
import OverviewCard from "@lib/admin-dashboard/components/OverviewCard";
import Select from "@lib/admin-dashboard/components/Select";
import {
  MONTHS,
  MONTHS_INDEX,
  MONTHS_MAP,
} from "@lib/admin-dashboard/constants/months";
import styles from "@lib/admin-overview/components/RevenueEventOverview/styles.module.css";
import OverviewData from "@lib/admin-overview/components/RevenueEventOverview/Events/OverviewData";
import { useRouter } from "next/router";
import useEventsOverview from "@lib/admin-overview/hooks/useEventsOverview";
import Loader from "@common/components/Icons/Loader";

const Events: FC = () => {
  const router = useRouter();
  const month = router.query?.event_overview_month as string;
  const parsedMonth = month ? Number(month) : 1;
  const selectedMonth = MONTHS_MAP[parsedMonth];
  const selectMonth = (month: number) => {
    router.push({
      query: {
        ...router.query,
        event_overview_month: month,
      },
    });
  };

  const { data: events } = useEventsOverview();

  return (
    <OverviewCard>
      <CardHeader title={"Event Overview"} />
      <div className={styles.cardbody}>
        <Select
          options={MONTHS_INDEX}
          optionsDisplay={MONTHS}
          onSelect={selectMonth}
          selectedOption={selectedMonth}
        />
        {!events ? (
          <Loader color={"black"} size={60} className={"mx-auto"} />
        ) : (
          <div className={styles.eventsoverview}>
            <OverviewData
              className={"w-5/12"}
              title={"Ticket Sold"}
              value={events.tickets_sold}
            />
            <OverviewData
              className={"w-5/12"}
              title={"Events Created"}
              value={events.events_created}
            />
            <OverviewData
              className={"w-[27%]"}
              title={"Users"}
              value={events.users}
            />
            <OverviewData
              className={"w-[27%]"}
              title={"Staffs"}
              value={events.staffs}
            />
            <OverviewData
              className={"w-[27%]"}
              title={"Event Organisers"}
              value={events.organizers}
            />
          </div>
        )}
      </div>
    </OverviewCard>
  );
};

export default Events;
