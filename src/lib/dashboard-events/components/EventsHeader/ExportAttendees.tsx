import { FC } from "react";
import { PropsWithCloseModal } from "@common/typings";
import styles from "@lib/dashboard-events/components/EventsHeader/styles.module.css";
import ClickAwayListener from "react-click-away-listener";
import ExportForm from "@lib/dashboard-events/components/EventsHeader/ExportForm";

const ExportAttendees: FC<PropsWithCloseModal> = ({ closeModal }) => {
  return (
    <ClickAwayListener onClickAway={closeModal}>
      <div className={styles.selecteventtypewrapper}>
        <div className={styles.body}>
          <h4>Select an event</h4>
        </div>
        <ExportForm />
      </div>
    </ClickAwayListener>
  );
};

export default ExportAttendees;
