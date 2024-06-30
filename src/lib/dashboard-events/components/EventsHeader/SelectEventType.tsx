import ButtonLink from "@common/components/ButtonLink";
import { SelectEventTypeProps } from "@lib/dashboard-events/typings";
import { FC } from "react";
import ClickAwayListener from "react-click-away-listener";
import styles from "./styles.module.css";
import { PropsWithCloseModal } from "@common/typings";

const SelectEventType: FC<PropsWithCloseModal> = ({ closeModal }) => {
  return (
    <ClickAwayListener onClickAway={closeModal}>
      <div className={styles.selecteventtypewrapper}>
        <div className={styles.body}>
          <h4>What type of event are you creating?</h4>
          <div className={styles.linkscontainer}>
            <ButtonLink
              href="/organizer/dashboard/events/create?type=physical"
              variant="outline"
            >
              Physical
            </ButtonLink>
            <ButtonLink
              href="/organizer/dashboard/events/create?type=virtual"
              variant="outline"
            >
              Virtual
            </ButtonLink>
          </div>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default SelectEventType;
