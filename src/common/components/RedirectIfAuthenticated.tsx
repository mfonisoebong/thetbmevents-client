import { FC, PropsWithChildren } from "react";
import useAuth from "@common/hooks/useAuth";
import { useRouter } from "next/router";
import Loader from "@common/components/RouteLoader/Loader";
import { dashboardLink } from "@common/utils/dashboardLink";
import useRedirectUri from "@lib/auth-pages/hooks/useRedirectUri";

const RedirectIfAuthenticated: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { getRedirectUri, removeRedirectUri } = useRedirectUri();
  const redirectUri = getRedirectUri();

  if (user.isLoading) {
    return <Loader />;
  }

  if (user.data && redirectUri) {
    router.push(redirectUri);
    removeRedirectUri();
    return null;
  }

  if (user.data) {
    router.push(dashboardLink(user.data));
    return null;
  }

  return <>{children}</>;
};

export default RedirectIfAuthenticated;
