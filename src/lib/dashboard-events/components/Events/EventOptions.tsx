import { FC } from "react";
import styles from "./styles.module.css";
import IconButton from "@common/components/IconButton";
import Ellipsis from "@common/components/Icons/Ellipsis";
import Link from "next/link";
import { EventOptionsProps } from "@lib/dashboard-events/typings";
import Close from "@common/components/Icons/Close";
import { useMutation } from "@tanstack/react-query";
import { deleteEvent } from "@lib/dashboard-events/helpers/deleteEvent";
import useAlertContext from "@common/hooks/useAlertContext";
import useUserEvents from "@lib/dashboard-events/hooks/useUserEvents";
const EventOptions: FC<EventOptionsProps> = ({
  id,
  showOptions,
  toggleShowOptions,
}) => {
  const { handleOpenAlert } = useAlertContext();
  const { refetch } = useUserEvents();
  const { isLoading, mutate } = useMutation({
    mutationFn: deleteEvent,
    onSuccess() {
      handleOpenAlert({
        type: "success",
        body: "Event deleted successfully",
        title: "Success",
      });
      refetch();
    },
    onError() {
      handleOpenAlert({
        type: "error",
        body: "An error occured",
        title: "Failed",
      });
    },
  });

  const deleteEventAction = () => {
    mutate({ id });
  };

  return (
    <td className={styles.options}>
      <IconButton
        onClick={toggleShowOptions}
        icon={showOptions ? <Close /> : <Ellipsis />}
        className="fill-gray-900 hover:fill-gray-500"
      />
      {showOptions && (
        <div className={styles.optionscontainer}>
          <Link href={`/organizer/dashboard/events/edit/${id}`}>Edit</Link>
          <button onClick={deleteEventAction} disabled={isLoading}>
            Delete
          </button>
        </div>
      )}
    </td>
  );
};

export default EventOptions;
