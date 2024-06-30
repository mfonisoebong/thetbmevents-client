import useAuth from "@common/hooks/useAuth";
import { FC } from "react";
import Loader from "../RouteLoader/Loader";
import { useRouter } from "next/router";
import { ProtectedRouteProps } from "@common/typings";

const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  emailVerified,
}) => {
  const { user } = useAuth();
  const router = useRouter();

  const accountPending =
    user.data?.account_state === "pending" && user.data.role === "organizer";
  const pageInVerificationPage =
    router.pathname === "/organizer/dashboard/verification/pending";

  const isInOrganizerDashboard = router.pathname.startsWith("/organizer");

  if (user.isLoading) {
    return null;
  }

  if (!user.data) {
    router.push("/login");
  }

  if (!user.data?.email_verified_at && emailVerified) {
    router.push("/verify/otp");
  }

  if (accountPending && isInOrganizerDashboard && !pageInVerificationPage) {
    router.push("/organizer/dashboard/verification/pending");
  }

  return <>{children}</>;
};

export default ProtectedRoute;
