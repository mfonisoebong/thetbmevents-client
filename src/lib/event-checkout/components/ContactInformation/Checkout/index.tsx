import { FC } from "react";
import Continue from "@lib/event-checkout/components/Continue";
import { useFormContext } from "react-hook-form";
import { ContactInformationFormType } from "@lib/event-checkout/utils/contactInformationSchema";
import { useRouter } from "next/router";
import FormField from "@common/components/FormControls/FormField";
import styles from "./styles.module.css";

const Checkout: FC = () => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useFormContext<ContactInformationFormType>();
  const onSubmit = () => {
    router.push({
      query: {
        ...router.query,
        view: "pay",
      },
    });
  };
  return (
    <div className="space-y-2">
      <FormField
        className={styles.input}
        label={"Coupon Code"}
        {...register("couponCode")}
        error={errors.couponCode?.message}
      />
      <Continue onClick={handleSubmit(onSubmit)} />
    </div>
  );
};

export default Checkout;
