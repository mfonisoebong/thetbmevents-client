import { FC } from "react";
import styles from "./styles.module.css";
import FormField from "@common/components/FormControls/FormField";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import Link from "next/link";
import Button from "@common/components/Button";
import GoogleButton from "@lib/auth-pages/components/GoogleButton/GoogleButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LoginFormSchema,
  LoginFormType,
} from "@lib/login/utils/loginFormSchema";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@lib/login/helpers/loginUser";
import useAlertContext from "@common/hooks/useAlertContext";
import { errorParser } from "@common/utils/errorParser";
import useAuth from "@common/hooks/useAuth";
import { sendPasswordResetLink } from "@lib/login/helpers/sendPasswordResetLink";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import useRedirectUri from "@lib/auth-pages/hooks/useRedirectUri";
const LoginForm: FC = () => {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const { handleOpenAlert } = useAlertContext();
  const {
    user: { refetch },
  } = useAuth();
  const { mutate, isLoading } = useMutation({
    mutationFn: loginUser,
    async onSuccess() {
      handleOpenAlert({
        body: "Logged in succesfully",
        title: "Success",
        type: "success",
      });
      await refetch();
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
    getValues,
    trigger,
  } = useForm<LoginFormType>({
    resolver: zodResolver(LoginFormSchema),
  });
  const { mutate: sendResetLink, isLoading: isSending } = useMutation({
    mutationFn: sendPasswordResetLink,
    onSuccess() {
      handleOpenAlert({
        body: "Check your e-mail for the password reset link",
        title: "Success",
        type: "success",
      });
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Failed",
        type: "error",
      });
    },
  });

  const isMediumDevice = useMediaQuery(Device.medium);
  const inputHeight = isMediumDevice ? "4rem" : "3.3rem";
  const buttonEnabled = !!executeRecaptcha;
  const onFormSubmit = async (data: LoginFormType) => {
    if (!executeRecaptcha) return;
    const token = await executeRecaptcha().then((res) => res);
    mutate({ ...data, recaptcha: token });
  };

  const mutateSendResetLink = async () => {
    const isValid = await trigger("email");

    if (!isValid) {
      handleOpenAlert({
        body: "Type your email",
        title: "Failed",
        type: "error",
      });
      return;
    }
    const email = getValues("email");
    sendResetLink({
      email,
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className={styles.form}>
      <FormField
        placeholder="Email address"
        type="email"
        style={{
          height: inputHeight,
        }}
        error={errors.email?.message}
        {...register("email")}
      />
      <FormField
        type="password"
        autoCapitalize="off"
        autoComplete="off"
        placeholder="Password"
        style={{
          height: inputHeight,
        }}
        error={errors.password?.message}
        {...register("password")}
      >
        <button
          onClick={mutateSendResetLink}
          type={"button"}
          disabled={isSending}
          className={styles.forgotpassword}
        >
          Forgot Password?
        </button>
      </FormField>

      <p className={styles.redirecttootherauth}>
        Don’t have an account? <Link href="/signup/organizer">Sign Up</Link>
      </p>
      <div className={styles.formbutton}>
        <Button
          disabled={!buttonEnabled}
          loading={isLoading}
          size="lg"
          type="submit"
        >
          Login
        </Button>
        <GoogleButton />
      </div>
    </form>
  );
};

export default LoginForm;
