import { FC } from "react";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import tableStyles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import TableHead from "@lib/admin-overview/components/TopOrganizers/TableHead";
import styles from "./styles.module.css";
import TableRow from "@lib/admin-overview/components/TopOrganizers/TableRow";
import useOverview from "@lib/admin-overview/hooks/useOverview";
const TopOrganizers: FC = () => {
  const { data: overview } = useOverview();

  return (
    <OverviewCard theme={"light"}>
      <div className={styles.wrapper}>
        <table className={tableStyles.table}>
          <TableHead />
          <tbody>
            {overview?.top_organizers.map((o, index) => (
              <TableRow
                name={o.organizer}
                ticket={{
                  name: o.title,
                  sold: o.tickets_sold,
                }}
                key={o.id + index}
              />
            ))}
          </tbody>
        </table>
      </div>
    </OverviewCard>
  );
};

export default TopOrganizers;
