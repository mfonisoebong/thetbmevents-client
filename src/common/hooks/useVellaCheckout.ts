import { useRouter } from "next/router";
import VellaCheckout from "vella-pay";
import usePaymentMethods from "@lib/admin-payment-method/hooks/usePaymentMethods";
import { v4 } from "uuid";
import useTotalAmount from "@lib/event-checkout/hooks/useTotalAmount";
import { useFormContext } from "react-hook-form";
import { ContactInformationFormType } from "@lib/event-checkout/utils/contactInformationSchema";
import { vellaGenerateInvoice } from "@lib/event-checkout/helpers/vellaGenerateInvoice";
import useTicketsContext from "@lib/event-checkout/hooks/useTicketsContext";

type VellaConfig = {
  email: string;
  name: string;
  amount: number;
  currency: "NGN";
  merchant_id: string;
  reference: string;
  custom_meta: {};
  source: string;
};

export interface PaymentCompleteResponseData {
  reference: string;
}

export default function useVellaCheckout() {
  const { data: method } = usePaymentMethods("vella");
  const { totalAmount } = useTotalAmount();
  const { selectedTickets } = useTicketsContext();
  const { getValues } = useFormContext<ContactInformationFormType>();
  const formValues = getValues();
  const router = useRouter();
  const vellaKey =
    process.env.NODE_ENV === "production"
      ? method?.vella_live_key
      : method?.vella_test_key;
  const merchantId = method?.vella_tag;
  const initializePayment = async () => {
    if (!merchantId) return;
    const reference = v4();

    const userName = `${formValues.customer.firstName} ${formValues.customer.lastName}`;

    const config: VellaConfig = {
      email: formValues.customer.email,
      amount: totalAmount,
      currency: "NGN",
      source: "web",
      name: userName,
      reference,
      custom_meta: {},
      merchant_id: `${method?.vella_tag}`,
    };

    try {
      await vellaGenerateInvoice(reference, {
        customer_email: formValues.customer.email,
        customer_first_name: formValues.customer.firstName,
        customer_last_name: formValues.customer.lastName,
        customer_phone_dial_code: formValues.customer.phone.dialCode,
        attendees: formValues.attendees,
        tickets: selectedTickets,
        customer_phone_number: formValues.customer.phone.number,
      });

      const vellaSDK = new VellaCheckout(vellaKey, config);

      vellaSDK.init();

      vellaSDK.onSuccess(async () => {
        router.push("/events/payment-complete");
      });

      vellaSDK.onError((error: Error) => {
        console.log(error);
      });
      vellaSDK.onClose(() => {});
    } catch (err) {
      console.log(err);
    }
  };

  return {
    initializePayment,
  };
}
