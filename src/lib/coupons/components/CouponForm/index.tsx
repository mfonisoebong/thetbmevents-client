import { FC } from "react";
import FormField from "@common/components/FormControls/FormField";
import styles from "@lib/create-event/components/EventForms/styles.module.css";
import { twMerge } from "tailwind-merge";
import FormSelectField from "@common/components/FormControls/FormSelectField";
import useUserEvents from "@lib/dashboard-events/hooks/useUserEvents";
import Button from "@common/components/Button";
import { useForm } from "react-hook-form";
import {
  CouponFormSchema,
  CouponSchemaType,
} from "@lib/coupons/utils/couponFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { saveCoupon } from "@lib/coupons/helpers/saveCoupon";
import useAlertContext from "@common/hooks/useAlertContext";
import { useRouter } from "next/router";
import { ICouponFormProps } from "@lib/coupons/typings";
import { errorParser } from "@common/utils/errorParser";
import useEvents from "@lib/admin-slider/hooks/useEvents";
import useAuth from "@common/hooks/useAuth";

export const CouponForm: FC<ICouponFormProps> = ({ coupon }) => {
  const c = twMerge(styles.form, "space-y-4");
  const {
    formState: { errors },
    register,
    handleSubmit,
    watch,
    reset,
  } = useForm<CouponSchemaType>({
    resolver: zodResolver(CouponFormSchema),
    defaultValues: {
      value: coupon?.value,
      type: coupon?.type,
      endDateTime: coupon?.end_date_time,
      startDateTime: coupon?.start_date_time,
      code: coupon?.code,
      name: coupon?.name,
      eventId: coupon?.event_id,
      status: coupon?.status,
      limit: coupon?.limit ?? null,
      referralEmail: coupon?.referral_email,
      referralName: coupon?.referral_name,
    },
  });

  const { handleOpenAlert } = useAlertContext();
  const router = useRouter();
  const { mutate, isLoading } = useMutation({
    mutationFn: saveCoupon,
    onSuccess() {
      handleOpenAlert({
        title: "Success",
        type: "success",
        body: "Coupon created successfully",
      });
      reset();
      router.push("/organizer/dashboard/coupons");
    },
    onError(err) {
      handleOpenAlert({
        title: "Error",
        type: "error",
        body: errorParser(err),
      });
    },
  });
  const { user } = useAuth();
  const { data: userEvents } = useUserEvents();
  const { data: adminEvents } = useEvents();

  const events = user.data?.role === "admin" ? adminEvents : userEvents;

  const eventsList =
    events?.map((e) => ({
      title: e.title,
      id: e.id,
    })) ?? [];

  const onSubmit = handleSubmit((data) => {
    const id = router.query?.id as string;
    mutate({
      id,
      ...data,
    });
  });

  const valueLabel = watch("type")
    ? `${watch("type") === "fixed" ? "Value (NGN)" : "Value (%)"}`
    : "Value";

  return (
    <form onSubmit={onSubmit} className={c}>
      <FormField
        {...register("name")}
        error={errors.name?.message}
        label={"Name"}
      />
      <FormField
        {...register("code")}
        error={errors.code?.message}
        label={"Coupon code"}
      />
      <FormField
        {...register("startDateTime")}
        error={errors.startDateTime?.message}
        label={"Start date time"}
        type={"datetime-local"}
      />
      <FormField
        {...register("endDateTime")}
        error={errors.endDateTime?.message}
        label={"End date time"}
        type={"datetime-local"}
      />
      <FormSelectField
        {...register("type")}
        error={errors.type?.message}
        label={"Type"}
      >
        <option value="">Select an option</option>
        <option value="percentage">Percentage</option>
        <option value="fixed">Fixed</option>
      </FormSelectField>
      <FormField
        {...register("value", {
          valueAsNumber: true,
        })}
        error={errors.value?.message}
        label={valueLabel}
        type={"number"}
      />
      <FormSelectField
        {...register("eventId")}
        error={errors.eventId?.message}
        label={"Event"}
      >
        <option value="">Select an event</option>
        {eventsList.map((e) => (
          <option key={e.id} value={e.id}>
            {e.title}
          </option>
        ))}
      </FormSelectField>

      <FormSelectField
        {...register("status")}
        error={errors.status?.message}
        label={"Status"}
      >
        <option value="">Select an option</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </FormSelectField>

      <FormField
        type="number"
        error={errors.limit?.message}
        label={"Limit"}
        {...register("limit", {
          valueAsNumber: true,
        })}
      />

      <FormField
        error={errors.referralName?.message}
        label={"Referral name"}
        {...register("referralName")}
      />
      <FormField
        error={errors.referralEmail?.message}
        label={"Referral email"}
        {...register("referralEmail")}
      />

      <Button loading={isLoading}>Save</Button>
    </form>
  );
};
