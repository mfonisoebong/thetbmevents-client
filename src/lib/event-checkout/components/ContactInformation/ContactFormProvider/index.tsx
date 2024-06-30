import { FC, PropsWithChildren } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  ContactInformationFormType,
  ContactInformationSchema,
} from "@lib/event-checkout/utils/contactInformationSchema";
import { zodResolver } from "@hookform/resolvers/zod";

const ContactFormProvider: FC<PropsWithChildren> = ({ children }) => {
  const contactForm = useForm<ContactInformationFormType>({
    resolver: zodResolver(ContactInformationSchema),
  });
  return <FormProvider {...contactForm}>{children}</FormProvider>;
};

export default ContactFormProvider;
