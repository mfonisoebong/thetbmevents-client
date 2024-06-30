import { FC } from "react";
import styles from "./styles.module.css";
import LayoutContainer from "@lib/event-checkout/components/LayoutContainer";
import ContactForm from "@lib/event-checkout/components/ContactInformation/ContactForm";
import Attendees from "@lib/event-checkout/components/ContactInformation/Attendees";
import Continue from "@lib/event-checkout/components/Continue";
import { useFormContext } from "react-hook-form";
import { ContactInformationFormType } from "@lib/event-checkout/utils/contactInformationSchema";
import { useRouter } from "next/router";

const ContactInformation: FC = () => {
  const { handleSubmit } = useFormContext<ContactInformationFormType>();
  const router = useRouter();
  const onSubmit = () => {
    router.push({
      query: {
        ...router.query,
        view: "pay",
      },
    });
  };

  return (
    <LayoutContainer className={"lg:w-8/12"} title={"Contact Information"}>
      <div className={styles.contactformcontainer}>
        <ContactForm />
        <Attendees />
        <Continue onClick={handleSubmit(onSubmit)} />
      </div>
    </LayoutContainer>
  );
};
export default ContactInformation;
