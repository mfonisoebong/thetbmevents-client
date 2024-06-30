import { FC } from "react";
import { NotificationProps } from "@lib/dashboard-notifications/typings";
import styles from "./styles.module.css";
import moment from "moment";

const Notification: FC<NotificationProps> = ({ body, createdAt, unread }) => {
  const formattedDate = moment(createdAt).format("DD MMM, YYYY");
  const formattedTime = moment(createdAt).format("MM:ss");

  return (
    <div
      style={{
        opacity: unread ? 1 : 0.5,
      }}
      className={styles.notification}
    >
      <p>{body}.</p>
      <small>
        {formattedDate} at {formattedTime}
      </small>
    </div>
  );
};

export default Notification;
