import { FC, PropsWithChildren, useCallback, useState } from "react";
import { AlertContext } from "./Context";
import { AlertMessage } from "@common/typings";
import Alert from "@common/components/Alert";

const AlertProvider: FC<PropsWithChildren> = ({ children }) => {
  const [alertMessages, setAlertMessages] = useState<AlertMessage[]>([]);

  const handleOpenAlert = useCallback((alert: AlertMessage) => {
    setAlertMessages((state) => [...state, alert]);
  }, []);

  const closeAlert = useCallback((index: number) => {
    setAlertMessages((state) => state.filter((_, i) => i !== index));
  }, []);

  return (
    <AlertContext.Provider value={{ closeAlert, handleOpenAlert }}>
      <Alert alertMessages={alertMessages} />
      {children}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
