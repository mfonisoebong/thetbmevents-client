import { FC } from "react";
import { ITableRowProps } from "@lib/coupons/typings";
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css";
import { useRouter } from "next/router";
import IconButton from "@common/components/IconButton";
import Trash from "@common/components/Icons/Trash";
import { useMutation } from "@tanstack/react-query";
import { deleteCoupon } from "@lib/coupons/helpers/deleteCoupon";
import useCoupons from "@lib/coupons/hooks/useCoupons";
import useAlertContext from "@common/hooks/useAlertContext";

const TableRow: FC<ITableRowProps> = ({ coupon }) => {
  const router = useRouter();
  const coupons = useCoupons();
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: deleteCoupon,
    onSuccess() {
      coupons.refetch();
      handleOpenAlert({
        body: "Coupon deleted successfully",
        type: "success",
        title: "Success",
      });
    },
    onError() {
      handleOpenAlert({
        body: "Could not delete coupon",
        type: "error",
        title: "Error",
      });
    },
  });

  const editCoupon = () => {
    router.push(`/organizer/dashboard/coupons/${coupon.id}`);
  };

  const removeCoupon = () => {
    mutate(coupon.id);
  };

  return (
    <tr className={styles.tablerow}>
      <td onClick={editCoupon} className="w-max whitespace-nowrap">
        {coupon.name}
      </td>
      <td onClick={editCoupon} className="w-max whitespace-nowrap">
        {coupon.code}
      </td>
      <td onClick={editCoupon} className="w-max whitespace-nowrap capitalize">
        {coupon.type}
      </td>
      <td onClick={editCoupon} className="w-max whitespace-nowrap capitalize">
        {coupon.event}
      </td>
      <td onClick={editCoupon} className="w-max whitespace-nowrap capitalize">
        {coupon.status}
      </td>
      <td onClick={editCoupon} className="w-max whitespace-nowrap capitalize">
        {coupon.invoices_count}
      </td>
      <td className="w-max whitespace-nowrap capitalize">
        <IconButton
          onClick={removeCoupon}
          icon={<Trash className={"stroke-red-500"} />}
        />
      </td>
    </tr>
  );
};

export default TableRow;
