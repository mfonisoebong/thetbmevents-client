import { FC } from "react";
import PageSection from "@common/components/PageSection";
import { useForm } from "react-hook-form";
import {
  ContactUsFormType,
  ContactUsSchema,
} from "@lib/contact-us/utils/contactUsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import FormField from "@common/components/FormControls/FormField";
import FormTextAreaField from "@common/components/FormControls/FormTextAreaField";
import Button from "@common/components/Button";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "@lib/contact-us/helpers/sendContactMessage";
import useAlertContext from "@common/hooks/useAlertContext";

const ContactMessageForm: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactUsFormType>({
    resolver: zodResolver(ContactUsSchema),
  });
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: sendContactMessage,
    onSuccess() {
      handleOpenAlert({
        title: "Success",
        type: "success",
        body: "Contact message sent successully",
      });
      reset();
    },
    onError() {
      handleOpenAlert({
        title: "Error",
        type: "error",
        body: "An error occured",
      });
    },
  });
  const { executeRecaptcha } = useGoogleReCaptcha();
  const buttonEnabled = !!executeRecaptcha;
  const onFormSubmit = async (data: ContactUsFormType) => {
    if (!executeRecaptcha) return;

    const token = await executeRecaptcha();

    mutate({
      ...data,
      token,
    });
  };

  return (
    <PageSection title={"Contact Us"}>
      <form
        onSubmit={handleSubmit(onFormSubmit)}
        className="py-8 lg:py-14 text-sm w-full lg:w-8/12 mx-auto space-y-8"
      >
        <FormField
          placeholder={"Name"}
          {...register("name")}
          error={errors.name?.message}
        />
        <FormField
          placeholder={"Email address"}
          {...register("email")}
          error={errors.email?.message}
        />
        <FormField
          placeholder={"Subject"}
          {...register("subject")}
          error={errors.subject?.message}
        />
        <FormTextAreaField
          placeholder={"Message"}
          {...register("message")}
          error={errors.message?.message}
        />
        <Button
          loading={isLoading}
          type={"submit"}
          disabled={!buttonEnabled}
          className={"mx-auto"}
        >
          Submit
        </Button>
      </form>
    </PageSection>
  );
};

export default ContactMessageForm;
