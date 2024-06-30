import { FC } from "react";

const NoSelectedTickets: FC = () => {
  return (
    <p className="text-center font-light text-sm md:text-base py-3">
      Please choose a ticket to continue
    </p>
  );
};

export default NoSelectedTickets;
