import { FC } from "react";
import styles from "@lib/login/components/MainSection/styles.module.css";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  StaffFormSchema,
  StaffFormType,
} from "@lib/add-new-staff/utils/staffFormSchema";
import FormSelectField from "@common/components/FormControls/FormSelectField";
import FormField from "@common/components/FormControls/FormField";
import useCountries from "@common/hooks/useCountries";
import Loader from "@common/components/Icons/Loader";
import ArrowDown from "@common/components/Icons/ArrowDown";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import FormFieldset from "@common/components/FormControls/FormFieldset";
import { useMutation } from "@tanstack/react-query";
import Button from "@common/components/Button";
import { createStaff } from "@lib/add-new-staff/helpers/createStaff";
import useAlertContext from "@common/hooks/useAlertContext";
import { errorParser } from "@common/utils/errorParser";
import { adminRoles } from "@lib/add-new-staff/constants/adminRoles";

const StaffForm: FC = () => {
  const { handleOpenAlert } = useAlertContext();

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<StaffFormType>({
    resolver: zodResolver(StaffFormSchema),
  });
  const { isLoading, mutate } = useMutation({
    mutationFn: createStaff,
    onSuccess() {
      handleOpenAlert({
        body: "Created admin successfully",
        title: "Success",
        type: "success",
      });
      reset();
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      });
    },
  });
  const isMediumDevice = useMediaQuery(Device.medium);
  const iconSize = isMediumDevice ? 18 : 15;

  const { countries } = useCountries();
  const inputIcon = countries.isLoading ? (
    <Loader color="black" size={iconSize} />
  ) : (
    <ArrowDown color="black" size={iconSize} />
  );

  const onSubmit = (data: StaffFormType) => {
    mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <FormField
        placeholder="First name"
        error={errors.firstName?.message}
        {...register("firstName")}
      />
      <FormField
        error={errors.lastName?.message}
        {...register("lastName")}
        placeholder="Last name"
      />
      <FormField
        placeholder="Email Address"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormSelectField
        error={errors.adminRole?.message}
        {...register("adminRole")}
      >
        <option value="">--Select role--</option>

        {adminRoles.map((a) => (
          <option key={a.role} value={a.role}>
            {a.alias}
          </option>
        ))}
      </FormSelectField>

      <FormSelectField
        error={errors.country?.message}
        {...register("country")}
        icon={inputIcon}
      >
        <option value="">--Select a country--</option>
        {countries.data?.map((c) => (
          <option key={c.code + c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </FormSelectField>

      <FormFieldset
        errors={[errors.dialCode?.message, errors.phoneNumber?.message]}
      >
        <FormSelectField
          {...register("dialCode")}
          className="w-4/12 md:w-3/12"
          icon={inputIcon}
        >
          {countries.data?.map((c) => (
            <option key={c.code} value={c.dial_code}>
              {c.code} ({c.dial_code})
            </option>
          ))}
        </FormSelectField>
        <FormField className="w-8/12 md:w-9/12" {...register("phoneNumber")} />
      </FormFieldset>
      <div className={styles.formbutton}>
        <Button loading={isLoading} size="lg" type="submit">
          Create
        </Button>
      </div>
    </form>
  );
};

export default StaffForm;
