import { FC } from "react";
import { TableRowProps } from "@lib/admin-order-history/typings";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import { numberFormatter } from "@common/utils/numberFormatter";
import moment from "moment";
import ButtonLink from "@common/components/ButtonLink";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import Link from "next/link";
import { useRouter } from "next/router";

const TableRow: FC<TableRowProps> = (props) => {
  const createdAt = moment(props.created_at).format("DD-MM-YYYY");
  const isLarge = useMediaQuery(Device.large);

  const router = useRouter();
  const toViewPage = () => {
    router.push(`/dashboard/tickets/${props.id}`);
  };
  return (
    <tr onClick={toViewPage} className={styles.tablerow}>
      {isLarge ? (
        <>
          <td>{props.ticket_no}</td>
          <td>{props.event_name}</td>
          <td>{props.ticket_name}</td>
          <td>₦{numberFormatter(props.ticket_price, 2)} </td>
          <td>{props.organizer}</td>
          <td>{createdAt}</td>
          <td>
            <ButtonLink
              href={`/dashboard/tickets/${props.id}`}
              className={"text-sm px-1"}
              size={"sm"}
            >
              View
            </ButtonLink>
          </td>
        </>
      ) : (
        <>
          <td className={"space-y-1"}>
            <p className="font-bold hover:text-mainBlue cursor-pointer">
              <Link href={`/dashboard/tickets/${props.id}`}>
                {props.event_name}
              </Link>
            </p>
            <p className="font-medium italic">{props.ticket_no}</p>
          </td>
          <td>
            <p className="font-semibold text-mainBlue">{props.ticket_name}</p>
          </td>
        </>
      )}
    </tr>
  );
};

export default TableRow;
