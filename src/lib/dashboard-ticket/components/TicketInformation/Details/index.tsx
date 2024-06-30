import { FC } from "react";
import useTicket from "@lib/dashboard-ticket/hooks/useTicket";
import Detail from "@lib/dashboard-ticket/components/TicketInformation/Details/Detail";
import useAuth from "@common/hooks/useAuth";
import { isIndividual } from "@common/utils/isIndividual";
import { numberFormatter } from "@common/utils/numberFormatter";
import moment from "moment";
const Details: FC = () => {
  const { data: ticket } = useTicket();
  const { user } = useAuth();
  const username = isIndividual(user.data)
    ? `${user.data.first_name} ${user.data.last_name}`
    : user.data?.buisness_name;
  const date = moment(ticket?.date_purchased).format("DD/MM/YYYY");

  return (
    <div className={"space-y-6"}>
      <div className="mb-9">
        <h6
          className={"text-base md:text-lg lg:text-xl font-bold text-gray-800"}
        >
          {ticket?.event}
        </h6>
      </div>

      <Detail title={"Username"} body={username} />
      <Detail title={"Email"} body={user.data?.email} />
      <Detail title={"Ticket name"} body={ticket?.ticket} />
      <Detail
        title={"price"}
        body={<>&#8358; {numberFormatter(ticket?.price ?? 0)}</>}
      />
      <Detail title={"No. of tickets"} body={ticket?.quantity} />
      <Detail title={"date"} body={date} />
    </div>
  );
};

export default Details;
