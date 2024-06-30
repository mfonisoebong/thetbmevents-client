import { FC } from "react";
import Button from "@common/components/Button";
import { useMutation } from "@tanstack/react-query";
import { exportOrders } from "@lib/admin-order-history/helpers/exportOrders";
import useAlertContext from "@common/hooks/useAlertContext";
import { downloadCSVFile } from "@common/utils/downloadCSVFile";
import useOrderHistory from "@lib/admin-order-history/hooks/useOrderHistory";

const ExportAs: FC = () => {
  const { handleOpenAlert } = useAlertContext();
  const { data: history } = useOrderHistory();
  const { mutate, isLoading } = useMutation({
    mutationFn: exportOrders,
    onSuccess(data) {
      const date = Date.now();
      downloadCSVFile(data, `order_history_${date}`);
    },
    onError() {
      handleOpenAlert({
        type: "error",
        title: "Error",
        body: "An error occured",
      });
    },
  });

  const exportHistory = () => {
    if (!history) return;

    const ids = history.data.map((h) => h.id.toString());
    mutate(ids);
  };

  return (
    <Button
      variant={"outline"}
      size={"sm"}
      loading={isLoading}
      disabled={isLoading}
      onClick={exportHistory}
      className={"text-xs px-6 w-max rounded-md"}
    >
      Export
    </Button>
  );
};

export default ExportAs;
