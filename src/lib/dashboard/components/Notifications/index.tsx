import useNotifications from "@lib/dashboard/hooks/useNotifications";
import useSidebarContext from "@lib/dashboard/hooks/useSidebarContext";
import { FC } from "react";
import ClickAwayListener from "react-click-away-listener";

const Notifications: FC = () => {
  const { showNotifications, toggleShowNotifications } = useSidebarContext();

  const { data: notifications } = useNotifications();

  if (!showNotifications) return null;

  const onClickAway = () => {
    if (showNotifications) {
      toggleShowNotifications();
    }
  };

  return (
    <div className="absolute md:relative right-0 top-0 w-full md:w-5/12 lg:w-3/12  h-full backdrop-blur-lg">
      <ClickAwayListener onClickAway={onClickAway}>
        <div className="bg-white h-full p-5 w-8/12 md:w-full right-0 absolute">
          <h4 className="font-bold text-sm md:text-base">Notifications</h4>
          {JSON.stringify(notifications)}
        </div>
      </ClickAwayListener>
    </div>
  );
};

export default Notifications;
