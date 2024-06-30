import { useContext } from "react";
import { DatePickerContext } from "@lib/dashboard-finance/contexts/DatePicker/Context";

export default function useDatePickerContext() {
  return useContext(DatePickerContext);
}
