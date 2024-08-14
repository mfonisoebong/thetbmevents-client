import { FC } from "react";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import { TableRowProps } from "@lib/dashboard-sales/typings";
import { numberFormatter } from "@common/utils/numberFormatter";
import moment from "moment";
import { useMutation } from "@tanstack/react-query";
import Button from "@common/components/Button";
import { resendPurchasedTickets } from "@lib/dashboard-sales/helpers/resendPurchasedTickets";
import useAlertContext from "@common/hooks/useAlertContext";
const TableRow: FC<TableRowProps> = (props) => {
  const boughtAt = moment(props.created_at).format("DD/MM/YYYY");

  const { handleOpenAlert } = useAlertContext();

  const { mutate, isLoading } = useMutation({
    mutationFn: resendPurchasedTickets,
    onSuccess() {
      handleOpenAlert({
        body: "Invoice sent successfully",
        title: "Success",
        type: "success",
      });
    },
    onError() {
      handleOpenAlert({
        body: "An error occurred while sending invoice",
        title: "Error",
        type: "error",
      });
    },
  });

  const handleSendInvoice = () => {
    mutate(props.id);
  };

  return (
    <tr className={styles.tablerow}>
      <td className="w-max whitespace-nowrap">{props.customer.name}</td>
      <td className="w-max whitespace-nowrap">{props.customer.email}</td>
      <td className="w-max whitespace-nowrap">{props.ticket}</td>
      <td>₦{numberFormatter(props.price)}</td>
      <td>{props.tickets_bought}</td>
      <td>{boughtAt}</td>
      <td>
        <Button
          onClick={handleSendInvoice}
          loading={isLoading}
          size="sm"
          className="text-xs"
        >
          Send invoice
        </Button>
      </td>
    </tr>
  );
};

export default TableRow;
