import { FC } from "react";
import useFilteredEvents from "@lib/events/hooks/useFilteredEvents";
import Link from "next/link";
import styles from "../styles.module.css";
const Filters: FC = () => {
  const { data: events } = useFilteredEvents();
  if (events?.events?.length === 0 || !events?.events) return null;

  return (
    <div className={styles.filters}>
      {events?.events?.map((e) => (
        <div key={e.id} className={styles.filter}>
          <Link href={`/events/${e.alias}`}>{e.title}</Link>
        </div>
      ))}
    </div>
  );
};

export default Filters;
