import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import moment from "moment";
import MenuItems from "./MenuItems";
import { TableRowProps } from "@lib/admin-categories/typings";
import useModal from "@common/hooks/useModal";

const TableRow: FC<TableRowProps> = (props) => {
  const { openModal } = useModal();
  const dateJoined = moment(props.created_at).format("DD-MM-YYYY");

  const edit = () => {
    openModal({
      param: "categoryId",
      value: props.id.toString(),
    });
  };
  return (
    <tr className={styles.tablerow}>
      <>
        <td onClick={edit}>{props.category}</td>
        <td>{props.slug}</td>
        <td className="hidden md:block">{dateJoined}</td>
      </>
      <td>
        <MenuItems id={props.id.toString()} />
      </td>
    </tr>
  );
};

export default TableRow;
