import { FC } from "react";
import ContactUs from "@lib/event/components/Checkout/ContactUs";
import Proceed from "@lib/event/components/Checkout/Proceed";

const Checkout: FC = () => {
  return (
    <div
      className={
        "flex flex-col space-y-5 md:space-y-0 md:flex-row md:justify-between md:items-center"
      }
    >
      <ContactUs />
      <Proceed />
    </div>
  );
};

export default Checkout;
