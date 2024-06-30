export interface Token {
  available: boolean;
  value: string | null;
}

export type AuthenticationData<T> = T & {
  recaptcha: string;
};

export interface RecaptchaContextValues {
  token: string | null;
}

export interface RecaptchaProps {
  handleChangeToken: (token: string) => void;
}
