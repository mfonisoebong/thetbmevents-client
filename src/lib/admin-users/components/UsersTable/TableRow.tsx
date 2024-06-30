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
import IconButton from "@common/components/IconButton";
import Trash from "@common/components/Icons/Trash";
import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "@lib/admin-users/helpers/deleteUser";
import useUsers from "@lib/admin-users/hooks/useUsers";
import useAlertContext from "@common/hooks/useAlertContext";

const TableRow: FC<TableRowProps> = (props) => {
  const { refetch } = useUsers();
  const dateJoined = moment(props.created_at).format("DD-MM-YYYY");
  const { toggleSelected, selectedUserIds } = useSelectedUsersContext();
  const isLargeDevice = useMediaQuery(Device.large);
  const isSelected = selectedUserIds.includes(props.id);
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: deleteUser,
    onSuccess() {
      refetch();
    },
    onError() {
      handleOpenAlert({
        body: "An error occured",
        type: "error",
        title: "Error",
      });
    },
  });
  const mutateDelete = () => {
    mutate(props.id);
  };

  const onUserSelect = () => {
    toggleSelected(props.id);
  };

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
          <td>
            <IconButton
              loading={isLoading}
              onClick={mutateDelete}
              title={`Delete ${props.name}`}
              icon={<Trash size={16} color={"red"} />}
            />
          </td>
        </>
      )}
    </tr>
  );
};

export default TableRow;
