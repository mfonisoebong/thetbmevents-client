import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethodForm } from "@lib/admin-payment-method/typings";
import {
  VellaFormType,
  VellaSchema,
} from "@lib/admin-payment-method/utils/paymentMethodSchema";
import { FC } from "react";
import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import FormField from "@common/components/FormControls/FormField";
import styles from "./styles.module.css";
import Button from "@common/components/Button";
import useAlertContext from "@common/hooks/useAlertContext";
import { useMutation } from "@tanstack/react-query";
import { updateVellaMethod } from "@lib/admin-payment-method/helpers/updateVellaMethod";
import usePaymentMethods from "@lib/admin-payment-method/hooks/usePaymentMethods";

const VellaForm: FC<PaymentMethodForm> = ({ method }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VellaFormType>({
    resolver: zodResolver(VellaSchema),
    defaultValues: {
      liveKey: method?.vella_live_key,
      testKey: method?.vella_test_key,
      vellaTag: method?.vella_tag,
      webhookUrl: method?.vella_webhook_url,
    },
  });
  const { refetch } = usePaymentMethods("vella");
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: updateVellaMethod,
    onSuccess() {
      handleOpenAlert({
        body: "Vella payment method updated",
        title: "Success",
        type: "success",
      });
      refetch();
    },
    onError() {
      handleOpenAlert({
        body: "An error occured",
        title: "Error",
        type: "error",
      });
    },
  });

  const onSubmit = (data: VellaFormType) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormInput title="Vella tag">
        <FormField
          {...register("vellaTag")}
          error={errors.vellaTag?.message}
          placeholder="Type in your Vella Tag"
          className="w-full"
        />
      </FormInput>
      <FormInput title="Webhook URL">
        <FormField
          {...register("webhookUrl")}
          error={errors.webhookUrl?.message}
          placeholder="Type in your webhook URL"
          className="w-full"
        />
      </FormInput>
      <FormInput title="Live API key">
        <FormField
          {...register("liveKey")}
          error={errors.liveKey?.message}
          placeholder="Type in your live api key"
          className="w-full"
          type={"password"}
        />
      </FormInput>
      <FormInput title="Test API key">
        <FormField
          {...register("testKey")}
          error={errors.testKey?.message}
          placeholder="Type in your test api key"
          className="w-full"
          type={"password"}
        />
      </FormInput>

      <Button type="submit" loading={isLoading} className="mx-auto">
        Save
      </Button>
    </form>
  );
};
export default VellaForm;
