import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react";
import { DatePickerContext } from "@lib/dashboard-finance/contexts/DatePicker/Context";
import { useRouter } from "next/router";

const DatePickerProvider: FC<PropsWithChildren> = ({ children }) => {
  const [date, setDate] = useState(() => new Date());
  const router = useRouter();

  const nextDate = () => {
    const curretMonth = date.getMonth();
    const newDate = new Date(date);
    newDate.setMonth(curretMonth + 1);
    setDate(() => newDate);

    router.push({
      query: {
        year: newDate.getFullYear(),
        month: newDate.getMonth() + 1,
      },
    });
  };

  const prevDate = () => {
    const curretMonth = date.getMonth();
    const newDate = new Date(date);
    newDate.setMonth(curretMonth - 1);
    setDate(() => newDate);
    router.push({
      query: {
        year: newDate.getFullYear(),
        month: newDate.getMonth() + 1,
      },
    });
  };

  return (
    <DatePickerContext.Provider value={{ date, nextDate, prevDate }}>
      {children}
    </DatePickerContext.Provider>
  );
};

export default DatePickerProvider;
