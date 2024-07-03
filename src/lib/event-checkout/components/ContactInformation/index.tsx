import { FC } from "react";
import styles from "./styles.module.css";
import LayoutContainer from "@lib/event-checkout/components/LayoutContainer";
import ContactForm from "@lib/event-checkout/components/ContactInformation/ContactForm";
import Attendees from "@lib/event-checkout/components/ContactInformation/Attendees";
import Checkout from "./Checkout";

const ContactInformation: FC = () => {
  return (
    <LayoutContainer className={"lg:w-8/12"} title={"Contact Information"}>
      <div className={styles.contactformcontainer}>
        <ContactForm />
        <Attendees />
        <Checkout />
      </div>
    </LayoutContainer>
  );
};
export default ContactInformation;
