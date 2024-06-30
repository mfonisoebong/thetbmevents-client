import useAuth from "@common/hooks/useAuth";
import { useRouter } from "next/router";
import { FC, PropsWithChildren } from "react";
import { dashboardLink } from "@common/utils/dashboardLink";
import useRedirectUri from "@lib/auth-pages/hooks/useRedirectUri";

const RedirectWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();
  const { removeRedirectUri, getRedirectUri } = useRedirectUri();
  const redirectUrl = getRedirectUri();

  if (user.data && redirectUrl) {
    router.push(redirectUrl);
    removeRedirectUri();
    return null;
  }

  if (user.data) {
    router.push(dashboardLink(user.data));
    return null;
  }

  return <>{children}</>;
};

export default RedirectWrapper;
