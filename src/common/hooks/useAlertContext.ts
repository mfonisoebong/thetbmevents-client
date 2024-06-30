import { AlertContext } from "@common/contexts/Alert/Context";
import { useContext } from "react";

export default function useAlertContext() {
  return useContext(AlertContext);
}
