import { FC } from "react";
import styles from "../styles.module.css";
import FormField from "@common/components/FormControls/FormField";
import FormFieldset from "@common/components/FormControls/FormFieldset";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import useCountries from "@common/hooks/useCountries";
import Loader from "@common/components/Icons/Loader";
import ArrowDown from "@common/components/Icons/ArrowDown";
import FormSelectField from "@common/components/FormControls/FormSelectField";
import { useFormContext } from "react-hook-form";
import { ContactInformationFormType } from "@lib/event-checkout/utils/contactInformationSchema";

const ContactForm: FC = () => {
  const isMediumDevice = useMediaQuery(Device.medium);
  const iconSize = isMediumDevice ? 14 : 10;
  const { countries } = useCountries();
  const inputIcon = countries.isLoading ? (
    <Loader color="black" size={iconSize} />
  ) : (
    <ArrowDown color="black" size={iconSize} />
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useFormContext<ContactInformationFormType>();

  return (
    <div className={styles.formgrid}>
      <FormField
        {...register("customer.firstName")}
        error={errors.customer?.firstName?.message}
        label={"First name"}
        placeholder={"First name"}
      />
      <FormField
        {...register("customer.lastName")}
        error={errors.customer?.lastName?.message}
        label={"Last name"}
        placeholder={"Last name"}
      />
      <FormField
        label={"Email address"}
        {...register("customer.email")}
        error={errors.customer?.email?.message}
        placeholder={"email@thetbmevents.com"}
      />
      <FormField
        label={"Confirm email address"}
        {...register("customer.confirmEmail")}
        error={errors.customer?.confirmEmail?.message}
        placeholder={"email@thetbmevents.com"}
      />
      <FormFieldset
        errors={[
          errors.customer?.phone?.dialCode?.message,
          errors.customer?.phone?.number?.message,
        ]}
        label={"Phone number"}
      >
        <FormSelectField
          {...register("customer.phone.dialCode")}
          className="w-5/12"
          icon={inputIcon}
        >
          <option value={""}></option>

          {countries.data?.map((c) => (
            <option key={c.code} value={c.dial_code}>
              {c.code} ({c.dial_code})
            </option>
          ))}
        </FormSelectField>
        <FormField
          {...register("customer.phone.number")}
          placeholder={"111999000"}
        />
      </FormFieldset>
    </div>
  );
};

export default ContactForm;
