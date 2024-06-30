import { FC } from "react";
import Button from "@common/components/Button";
import useTicketQrCode from "@lib/dashboard-ticket/hooks/useTicketQrCode";
import styles from "../styles.module.css";
import { useRouter } from "next/router";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";

const TicketActions: FC = () => {
  const { data: qrCode } = useTicketQrCode();
  const router = useRouter();

  const isMediumDevice = useMediaQuery(Device.medium);

  const buttonSize = isMediumDevice ? "lg" : undefined;

  return (
    <div
      className={
        "space-y-6 md:space-y-16 lg:space-y-24 mt-16 md:mt-32 lg:mt-44 h-full"
      }
    >
      {qrCode && (
        <div
          className={styles.qrcode}
          dangerouslySetInnerHTML={{
            __html: qrCode,
          }}
        />
      )}

      <div className="flex justify-center space-x-4 items-center">
        <Button
          onClick={router.back}
          className={"px-12 md:px-16 text-sm md:text-base"}
          size={buttonSize}
          variant={"outline"}
        >
          Back
        </Button>
        <Button
          id="print"
          className={"bg-mainBlue px-12 md:px-16 text-sm md:text-base"}
          size={buttonSize}
        >
          Print
        </Button>
      </div>
    </div>
  );
};

export default TicketActions;
