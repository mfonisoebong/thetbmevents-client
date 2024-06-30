import { FC } from "react";
import { TableRowProps } from "@lib/admin-users/typings";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import FormCheck from "@common/components/FormControls/FormCheck";
import Avatar from "@common/components/Avatar";
import moment from "moment";
import { capitalizeFirstLetter } from "@common/utils/capitalizeFirstLetter";
import useSelectedUsersContext from "@lib/admin-users/hooks/useSelectedUsersContext";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import MenuItems from "./MenuItems";
import useAuth from "@common/hooks/useAuth";

const TableRow: FC<TableRowProps> = (props) => {
  const dateJoined = moment(props.created_at).format("DD-MM-YYYY");
  const { toggleSelected, selectedUserIds } = useSelectedUsersContext();
  const isLargeDevice = useMediaQuery(Device.large);
  const isSelected = selectedUserIds.includes(props.id);
  const onUserSelect = () => {
    toggleSelected(props.id);
  };
  const { user } = useAuth();
  const isCurrentUser = user.data?.id === props.id;

  return (
    <tr className={styles.tablerow}>
      <td
        style={{
          paddingInline: !isLargeDevice ? 15 : undefined,
        }}
      >
        <FormCheck onChange={onUserSelect} checked={isSelected} />
      </td>
      <td
        style={{
          paddingInline: !isLargeDevice ? 0 : undefined,
        }}
        className={"flex items-center space-x-3"}
      >
        <Avatar image={props.avatar} />
        <span>{props.name}</span>
      </td>
      {isLargeDevice && (
        <>
          <td>{props.email}</td>
          <td>{props.phone}</td>
          <td>{dateJoined}</td>
          <td>{capitalizeFirstLetter(props.role)}</td>
        </>
      )}
      {!isCurrentUser && (
        <td>
          <MenuItems status={props.account_status} id={props.id} />
        </td>
      )}
    </tr>
  );
};

export default TableRow;
