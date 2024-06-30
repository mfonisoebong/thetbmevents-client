import Button from "@common/components/Button";
import { ButtonProps } from "@common/typings";
import { FC } from "react";
import styles from "./styles.module.css";
import Icon from "./Icon";
import { useRouter } from "next/router";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

const GoogleButton: FC<ButtonProps> = (props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const { pathname } = useRouter();
  const isSignUpPage = pathname.startsWith("/signup");

  const onButtonClick = async () => {
    if (!executeRecaptcha) return;
    const token = await executeRecaptcha().then((res) => res);

    const callbackUrl = isSignUpPage
      ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/register/google?recaptcha_token=${token}`
      : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/auth/login/google?recaptcha_token=${token}`;

    window.open(callbackUrl, "_self");
  };

  return (
    <>
      <Button
        onClick={onButtonClick}
        size="lg"
        className={styles.googlebtn}
        {...props}
        type="button"
        variant="secondary"
      >
        <Icon />
        <span>Sign in with Google</span>
      </Button>
    </>
  );
};

export default GoogleButton;
