import { FC, useState } from "react";
import { TableRowProps } from "@lib/dashboard-tickets/typings";
import moment from "moment";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import IconButton from "@common/components/IconButton";
import Ellipsis from "@common/components/Icons/Ellipsis";
import Link from "next/link";
import useToggle from "@common/hooks/useToggle";
import ClickAwayListener from "react-click-away-listener";
import { useRouter } from "next/router";

const TableRow: FC<TableRowProps> = (props) => {
  const router = useRouter();
  const { toggle: showViewLink, handleToggle: toggleShowViewLink } =
    useToggle();
  const datePurchased = moment(props.date_purchased).format("DD/MM/YYYY");
  const toViewPage = () => {
    router.push(`/dashboard/tickets/${props.id}`);
  };
  return (
    <tr onClick={toViewPage} className={styles.tablerow}>
      <td className="w-max whitespace-nowrap">#{props.id}</td>
      <td className="w-max whitespace-nowrap">{props.event}</td>
      <td className="w-max whitespace-nowrap">{props.ticket}</td>
      <td>{datePurchased}</td>
      <td className={"relative"}>
        <IconButton
          onClick={toggleShowViewLink}
          icon={<Ellipsis color={"black"} size={14} />}
        />
        {showViewLink && (
          <ClickAwayListener onClickAway={toggleShowViewLink}>
            <Link
              className={
                "font-normal absolute text-xs right-10 px-4 py-2 shadow-lg hover:shadow-2xl"
              }
              href={`/dashboard/tickets/${props.id}`}
            >
              View
            </Link>
          </ClickAwayListener>
        )}
      </td>
    </tr>
  );
};

export default TableRow;
