import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import TableHead from "@lib/dashboard-sales/components/SalesTable/TableHead";
import TableRow from "@lib/dashboard-sales/components/SalesTable/TableRow";
import useSales from "@lib/dashboard-sales/hooks/useSales";
import Loader from "@common/components/RouteLoader/Loader";
import NoContent from "@common/components/NoContent";
import { useSearchParams } from "next/navigation";
const SalesTable: FC = () => {
  const { data: sales, isLoading } = useSales();
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  if (isLoading) return <Loader />;

  const hasSales = sales?.data.length !== 0;
  const filteredSales = search
    ? sales?.data?.filter(
        (s) =>
          s.customer.email.includes(search?.toLowerCase()) ||
          s.customer.name.toLowerCase().includes(search?.toLowerCase()),
      )
    : sales?.data;

  return (
    <div className={styles.wrapper}>
      {hasSales ? (
        <table className={styles.table}>
          <TableHead />
          <tbody>
            {filteredSales?.map((s) => <TableRow {...s} key={s.id} />)}
          </tbody>
        </table>
      ) : (
        <NoContent title={"No tickets sold yet"} />
      )}
    </div>
  );
};

export default SalesTable;
