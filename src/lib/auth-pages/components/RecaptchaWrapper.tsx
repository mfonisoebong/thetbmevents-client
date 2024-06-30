import { FC, PropsWithChildren } from "react";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

const RecaptchaWrapper: FC<PropsWithChildren> = ({ children }) => {
  const recaptchaKey = process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_KEY ?? "";

  return (
    <GoogleReCaptchaProvider reCaptchaKey={recaptchaKey ?? ""}>
      {children}
    </GoogleReCaptchaProvider>
  );
};

export default RecaptchaWrapper;
