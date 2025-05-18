import { TableRowProps } from "@lib/dashboard-events/typings";
import { FC, useState } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import Image from "next/image";
import EventOptions from "@lib/dashboard-events/components/Events/EventOptions";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import { noCacheImage } from "@common/utils/noCacheImage";
import { numberFormatter } from "@common/utils/numberFormatter";
import { useRouter } from "next/router";
import Clipboard from "@common/components/Icons/Clipboard";
import useAlertContext from "@common/hooks/useAlertContext";

const TableRow: FC<TableRowProps> = (props) => {
  const [showOptions, setShowOptions] = useState(false);
  const router = useRouter();
  const isMedium = useMediaQuery(Device.medium);
  const toggleShowOptions = () => {
    setShowOptions((state) => !state);
  };
  const { handleOpenAlert } = useAlertContext();

  const toEditPage = () => {
    router.push(`/organizer/dashboard/events/edit/${props.id}`);
  };

  const copyEventLink = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_CLIENT_URL}/events/${props.alias}`,
    );

    handleOpenAlert({
      type: "success",
      body: "Event link copied to clipboard",
      title: "Success",
    });
  };

  return (
    <tr className={styles.tablerow}>
      <td className="flex justify-center" onClick={toEditPage}>
        <Image
          unoptimized
          width={50}
          height={50}
          className="w-8 md:w-12 h-8 md:h-12 rounded-full object-cover"
          src={props.logo}
          alt={props.title}
        />
      </td>
      <td className="w-max whitespace-nowrap" onClick={toEditPage}>
        {props.title}
      </td>
      {isMedium && (
        <>
          <td>&#8358;{numberFormatter(props.ticket_price)}</td>
          <td>
            {new Intl.DateTimeFormat("en-US", {
              dateStyle: "medium",
            }).format(new Date(props.created_at))}
          </td>
        </>
      )}

      <EventOptions
        showOptions={showOptions}
        toggleShowOptions={toggleShowOptions}
        id={props.id}
      />
      <td>
        <button
          title="Copy event link"
          className="active:scale-75 duration-300"
        >
          <Clipboard onClick={copyEventLink} />
        </button>
      </td>
    </tr>
  );
};

export default TableRow;
