import { getUser } from "@common/helpers/getUser";
import { logoutUser } from "@common/helpers/logoutUser";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import useAlertContext from "@common/hooks/useAlertContext";
import { errorParser } from "@common/utils/errorParser";

export default function useAuth() {
  const token = () => Cookies.get("access_token_enocded");
  const { handleOpenAlert } = useAlertContext();
  const fetcher = () => getUser(token());
  const hasToken = typeof token() === "string";

  const user = useQuery(["user", token], fetcher, {
    enabled: hasToken,
  });

  const logout = async () => {
    try {
      await logoutUser(token());
      Cookies.remove("access_token_enocded");
      Cookies.remove("admin_id");
      user.remove();
      window.location.href = "/";
    } catch (err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      });
    }
  };

  return {
    user,
    logout,
  };
}
