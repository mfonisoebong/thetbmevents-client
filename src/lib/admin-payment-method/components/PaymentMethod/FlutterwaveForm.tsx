import { zodResolver } from "@hookform/resolvers/zod";
import { PaymentMethodForm } from "@lib/admin-payment-method/typings";
import {
    FlutterwaveFormType,
    FlutterwaveSchema,
} from "@lib/admin-payment-method/utils/paymentMethodSchema";
import { FC } from "react";
import { useForm } from "react-hook-form";
import FormInput from "./FormInput";
import FormField from "@common/components/FormControls/FormField";
import styles from "./styles.module.css";
import Button from "@common/components/Button";
import useAlertContext from "@common/hooks/useAlertContext";
import { useMutation } from "@tanstack/react-query";
import { updateFlwMethod } from "@lib/admin-payment-method/helpers/updateFlwMethod";
import usePaymentMethods from "@lib/admin-payment-method/hooks/usePaymentMethods";

const FlutterwaveForm: FC<PaymentMethodForm> = ({ method }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FlutterwaveFormType>({
    resolver: zodResolver(FlutterwaveSchema),
    defaultValues: {
      liveKey: method?.flutterwave_live_key,
      testKey: method?.flutterwave_test_key,
    },
  });
  const { refetch } = usePaymentMethods("flutterwave");
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: updateFlwMethod,
    onSuccess() {
      handleOpenAlert({
        body: "Flutterwave payment method updated",
        title: "Success",
        type: "success",
      });
      refetch();
    },
    onError() {
      handleOpenAlert({
        body: "An error occurred",
        title: "Error",
        type: "error",
      });
    },
  });

  const onSubmit = (data: FlutterwaveFormType) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
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
export default FlutterwaveForm;
