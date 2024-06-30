import { FC } from "react";
import styles from "../../styles.module.css";
import { TimeRemainingProps } from "@lib/home/typings";
import { numberFormatter } from "@common/utils/numberFormatter";

const TimeRemaining: FC<TimeRemainingProps> = ({ expireIn, ticketPrice }) => {
  return (
    <div
      className={`${styles.card}  ml-auto mr-auto w-max md:ml-auto md:mr-0 md:w-5/12 lg:w-4/12`}
    >
      <div className="mr-3">
        <h4 className="uppercase text-xs md:text-lg lg:text-xl font-bold">
          REMAINING TIME
        </h4>
        <div className="flex space-x-2 md:space-x-4 items-center">
          <h3 className={styles.time}>
            <p className={styles.timetitle}>{expireIn.d}</p>
            <small>Days</small>
          </h3>
          <h3 className={styles.time}>
            <p className={styles.timetitle}>{expireIn.h}</p>
            <small>Hours</small>
          </h3>
          <h3 className={styles.time}>
            <p className={styles.timetitle}>{expireIn.m}</p>
            <small>Minutes</small>
          </h3>
        </div>
      </div>
      <div className="md:space-y-1">
        <h4 className="uppercase text-xs md:text-lg lg:text-xl font-bold">
          price
        </h4>
        <p className={styles.timetitle}>
          {" "}
          &#8358;{numberFormatter(ticketPrice, 0)}
        </p>
      </div>
    </div>
  );
};

export default TimeRemaining;
