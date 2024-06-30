import { FC } from "react";
import { useSearchParams } from "next/navigation";
import ContactInformation from "@lib/event-checkout/components/ContactInformation";
import Tickets from "@lib/event-checkout/components/Tickets";
import ContactFormProvider from "@lib/event-checkout/components/ContactInformation/ContactFormProvider";
import PaymentOptions from "@lib/event-checkout/components/PaymentOptions";
import Previous from "@lib/event-checkout/components/MainContent/Previous";

const MainContent: FC = () => {
  const searchParams = useSearchParams();

  const view = () => {
    if (searchParams.get("view") === "contact-info") {
      return <ContactInformation />;
    }
    if (searchParams.get("view") === "pay") {
      return <PaymentOptions />;
    }
    return <Tickets />;
  };

  return (
    <ContactFormProvider>
      <Previous />
      {view()}
    </ContactFormProvider>
  );
};

export default MainContent;
