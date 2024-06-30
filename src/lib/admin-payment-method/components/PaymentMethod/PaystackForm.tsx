import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethodForm } from "@lib/admin-payment-method/typings";
import {
  PaystackFormType,
  PaystackSchema,
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
import usePaymentMethods from "@lib/admin-payment-method/hooks/usePaymentMethods";
import { updatePaystackMethod } from "@lib/admin-payment-method/helpers/updatePaystackMethod";

const PaystackForm: FC<PaymentMethodForm> = ({ method }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaystackFormType>({
    resolver: zodResolver(PaystackSchema),
    defaultValues: {
      liveKey: method?.paystack_live_key,
      testKey: method?.paystack_test_key,
      webhookUrl: method?.paystack_webhook_url,
    },
  });
  const { refetch } = usePaymentMethods("paystack");
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: updatePaystackMethod,
    onSuccess() {
      handleOpenAlert({
        body: "Paystack payment method updated",
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

  const onSubmit = (data: PaystackFormType) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
          type={"password"}
          error={errors.liveKey?.message}
          placeholder="Type in your live api key"
          className="w-full"
        />
      </FormInput>
      <FormInput title="Test API key">
        <FormField
          {...register("testKey")}
          type={"password"}
          error={errors.testKey?.message}
          placeholder="Type in your test api key"
          className="w-full"
        />
      </FormInput>

      <Button type="submit" loading={isLoading} className="mx-auto">
        Save
      </Button>
    </form>
  );
};
export default PaystackForm;
