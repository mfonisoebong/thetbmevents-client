import { FC } from "react";
import { RedirectUserProps } from "@lib/dashboard/typings";
import useAuth from "@common/hooks/useAuth";
import { isIndividual } from "@common/utils/isIndividual";
import { isAdmin } from "@common/utils/isAdmin";
import { useRouter } from "next/router";
import useHydrated from "@common/hooks/useHydrated";
import { dashboardLink } from "@common/utils/dashboardLink";

const RedirectUser: FC<RedirectUserProps> = ({ page, admin }) => {
  const { hydrated } = useHydrated();
  const { user } = useAuth();
  const router = useRouter();
  const individualUser = isIndividual(user.data);
  const adminUser = isAdmin(user.data);
  const organizer = !individualUser && !adminUser;
  const isInOrganizerRoute =
    router.pathname.startsWith("/organizer") && page === "organizer";
  const isInAdminRoute =
    router.pathname.startsWith("/admin") && page === "admin";
  const adminAllowed =
    user.data?.admin_role === admin || user.data?.admin_role === "super_admin";

  if (user.data && isInAdminRoute && !adminUser && hydrated) {
    router.push("/");
    return null;
  }

  if (user.data && isInOrganizerRoute && !organizer && hydrated) {
    router.push("/");
    return null;
  }

  if (user.data && admin && !adminAllowed && hydrated) {
    router.push(dashboardLink(user.data));
    return null;
  }

  return <></>;
};

export default RedirectUser;
