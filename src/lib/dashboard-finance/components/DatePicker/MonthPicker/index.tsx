import { FC } from "react";
import IconButton from "@common/components/IconButton";
import CaretLeft from "@common/components/Icons/CaretLeft";
import CaretRight from "@common/components/Icons/CaretRight";
import useDatePickerContext from "@lib/dashboard-finance/hooks/useDatePickerContext";
import moment from "moment/moment";

const MonthPicker: FC = () => {
  const { date, nextDate, prevDate } = useDatePickerContext();
  const month = moment(date).format("MMMM, YYYY");
  return (
    <div className={" flex items-center space-x-3"}>
      <IconButton onClick={prevDate} icon={<CaretLeft color={"black"} />} />
      <h4 className={"uppercase"}>{month}</h4>
      <IconButton onClick={nextDate} icon={<CaretRight color={"black"} />} />
    </div>
  );
};

export default MonthPicker;
