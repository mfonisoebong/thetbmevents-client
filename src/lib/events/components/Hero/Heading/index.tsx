import { FC } from "react";
import styles from "../styles.module.css";

const Heading: FC = () => {
  return (
    <div className={styles.heading}>
      <h2>Do more with TBM events</h2>
      <h3>
        Discover events from the variety of organizers that use TBM events as
        their trusted event-ticketing platform
      </h3>
    </div>
  );
};

export default Heading;
