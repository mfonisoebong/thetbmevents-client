import { FC } from "react";
import { TicketDetailsProps } from "@lib/event-checkout/typings";
import ErrorText from "@common/components/ErrorText";
import moment from "moment";

const TicketDetails: FC<TicketDetailsProps> = (props) => {
  const salesStartDate = moment(props.salesStart).format(
    "DD MMM YYYY,  hh:mm a",
  );

  const salesEndDate = moment(props.salesEnd).format("DD MMM YYYY,  hh:mm a");

  const salesTiminingAlert = () => {
    if (props.isEarly) {
      return (
        <ErrorText>Ticket sales is scheduled for {salesStartDate}</ErrorText>
      );
    }
    if (props.isLate) {
      return (
        <ErrorText>Ticket sales have stopped since {salesEndDate}</ErrorText>
      );
    }
    return null;
  };

  return (
    <div className="space-y-2">
      <div>
        <h4>{props.name}</h4>
        <h5>NGN {props.price.toLocaleString()}</h5>
      </div>
      <p className="text-sm font-light text-gray-600">{props.description}</p>
      {salesTiminingAlert()}
    </div>
  );
};

export default TicketDetails;
