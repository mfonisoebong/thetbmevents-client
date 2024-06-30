import { FC } from "react";
import styles from "@lib/login/components/MainSection/styles.module.css";
import FormField from "@common/components/FormControls/FormField";
import FormSelectField from "@common/components/FormControls/FormSelectField";
import useCountries from "@common/hooks/useCountries";
import Loader from "@common/components/Icons/Loader";
import ArrowDown from "@common/components/Icons/ArrowDown";
import Link from "next/link";
import Button from "@common/components/Button";
import GoogleButton from "@lib/auth-pages/components/GoogleButton/GoogleButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  OrganizationSignUpFormType,
  organizationSignupFormSchema,
} from "@lib/signup-main/utils/signupFormSchema";
import FormFieldset from "@common/components/FormControls/FormFieldset";
import FormCheck from "@common/components/FormControls/FormCheck";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import useAlertContext from "@common/hooks/useAlertContext";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "@lib/signup-main/helpers/signupUser";
import { errorParser } from "@common/utils/errorParser";
import useAuth from "@common/hooks/useAuth";
import { useRouter } from "next/router";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const OrganizationForm: FC = () => {
  const { handleOpenAlert } = useAlertContext();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const buttonEnabled = !!executeRecaptcha;
  const router = useRouter();
  const {
    user: { refetch },
  } = useAuth();
  const { mutate, isLoading } = useMutation({
    mutationFn: signupUser,
    onSuccess() {
      handleOpenAlert({
        body: "Created account successfully",
        title: "Success",
        type: "success",
      });
    },
    onError(error) {
      handleOpenAlert({
        body: errorParser(error),
        title: "Error",
        type: "error",
      });
    },
  });
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<OrganizationSignUpFormType>({
    resolver: zodResolver(organizationSignupFormSchema),
  });
  const isMediumDevice = useMediaQuery(Device.medium);
  const iconSize = isMediumDevice ? 18 : 15;
  const { countries } = useCountries();
  const inputIcon = countries.isLoading ? (
    <Loader color="black" size={iconSize} />
  ) : (
    <ArrowDown color="black" size={iconSize} />
  );

  const onFormSubmit = async (data: OrganizationSignUpFormType) => {
    if (!executeRecaptcha) return;
    const token = await executeRecaptcha().then((res) => res);
    mutate({ ...data, recaptcha: token });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>
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
      <FormField
        placeholder="Email Address"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />
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
      <FormField
        {...register("buisnessName")}
        placeholder="Registered business name"
        error={errors.buisnessName?.message}
      />
      <FormField
        error={errors.password?.message}
        {...register("password")}
        placeholder="Password"
        type="password"
      />
      <FormField
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
        placeholder="Confirm Password"
        type="password"
      />

      <p className={styles.redirecttootherauth}>
        Already have an account? <Link href="/login">Sign in</Link>
      </p>
      <FormCheck required className="mx-auto w-max">
        I agree to the <Link href="">Terms of service & Privacy Policy</Link>
      </FormCheck>
      <div className={styles.formbutton}>
        <Button
          loading={isLoading}
          disabled={!buttonEnabled}
          size="lg"
          type="submit"
        >
          Create Account
        </Button>
        <GoogleButton />
      </div>
    </form>
  );
};

export default OrganizationForm;
