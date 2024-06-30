import { FC, useState } from "react";
import Button from "@common/components/Button";
import SelectEventType from "./SelectEventType";
import { useMutation } from "@tanstack/react-query";
import { exportEventCsv } from "@lib/dashboard-events/helpers/exportEventsCsv";
import useAlertContext from "@common/hooks/useAlertContext";
import styles from "./styles.module.css";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import useAuth from "@common/hooks/useAuth";
import { errorParser } from "@common/utils/errorParser";
import { downloadCSVFile } from "@common/utils/downloadCSVFile";
import useToggle from "@common/hooks/useToggle";
import ExportAttendees from "@lib/dashboard-events/components/EventsHeader/ExportAttendees";

const HeaderActions: FC = () => {
  const { toggle: showEventType, handleToggle: toggleShowEventType } =
    useToggle();
  const { toggle: showExportForm, handleToggle: toggleExportForm } =
    useToggle();
  const { handleOpenAlert } = useAlertContext();
  const { user } = useAuth();
  const isLargeDevice = useMediaQuery(Device.large);
  const buttonSize = isLargeDevice ? "lg" : "sm";
  const { isLoading, mutate } = useMutation({
    mutationFn: exportEventCsv,
    onSuccess,
    onError(err) {
      handleOpenAlert({
        title: "Error",
        body: errorParser(err),
        type: "error",
      });
    },
  });
  function onSuccess(data: string) {
    const fileName = `${user.data?.id}_${Date.now()}_events`;
    downloadCSVFile(data, fileName);
  }

  const exportCsv = () => {
    //   const url= `${process.env.NEXT_PUBLIC_SERVER_URL}/api/events/export`
    // window.open(url, "_blank")
    mutate();
  };

  return (
    <div className={styles.headeractions}>
      <Button
        onClick={toggleShowEventType}
        size={buttonSize}
        variant={showEventType ? "primary" : "outline"}
      >
        {showEventType ? "Close" : " Add new"}
      </Button>
      <Button
        onClick={exportCsv}
        variant={isLoading ? "primary" : "outline"}
        size={buttonSize}
        disabled={isLoading}
        loading={isLoading}
      >
        Export
      </Button>
      <Button onClick={toggleExportForm} size={buttonSize}>
        Export Attedees
      </Button>
      {showExportForm && <ExportAttendees closeModal={toggleExportForm} />}
      {showEventType && <SelectEventType closeModal={toggleShowEventType} />}
    </div>
  );
};

export default HeaderActions;
