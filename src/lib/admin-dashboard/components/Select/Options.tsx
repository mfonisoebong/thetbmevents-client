import { FC } from "react";
import { Option, OptionsProps } from "@lib/admin-dashboard/typings";
import styles from "./styles.module.css";
import ClickAwayListener from "react-click-away-listener";
const Options: FC<OptionsProps> = (props) => {
  const options = props.optionsDisplay ?? props.options;
  const hasOptionsDisplay = props.optionsDisplay ? true : false;
  const onclickAway = () => {
    if (!props.onClickAway) return;
    props.onClickAway();
  };
  const onOptionSelect = (option: Option, hasListDisplay?: boolean) => {
    return () => {
      if (hasListDisplay) {
        const optionIndex = options.findIndex((o) => o === option);

        props.onSelect(props.options[optionIndex]);
        onclickAway();
        return;
      }

      props.onSelect(option);
      onclickAway();
    };
  };

  return (
    <ClickAwayListener onClickAway={onclickAway}>
      <div className={styles.options}>
        {options.map((o, index) => (
          <button
            onClick={onOptionSelect(o, hasOptionsDisplay)}
            key={`${o}${index}`}
          >
            {o}
          </button>
        ))}
      </div>
    </ClickAwayListener>
  );
};

export default Options;
