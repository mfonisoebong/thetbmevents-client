import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import { useEffect } from "react";
import useAuth from "@common/hooks/useAuth";

export default function useRedirectUri() {
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get("redirect");
  const storedRedirectUri = Cookies.get("redirect");
  const { user } = useAuth();

  const getRedirectUri = () => {
    return Cookies.get("redirect");
  };
  const removeRedirectUri = () => {
    return Cookies.remove("redirect");
  };

  useEffect(() => {
    if (!storedRedirectUri && redirectUri && !user.data) {
      Cookies.set("redirect", redirectUri);
    }
  }, [storedRedirectUri, redirectUri, user.data]);

  return {
    getRedirectUri,
    removeRedirectUri,
  };
}
