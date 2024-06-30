import { useCallback, useState } from "react";

type Token = string | null;

export default function useRecaptcha() {
  const [token, setToken] = useState<Token>(null);

  const handleChangeToken = useCallback((t: Token) => {
    setToken(t);
  }, []);
  return {
    token,
    handleChangeToken,
  };
}
