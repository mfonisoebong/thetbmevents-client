import { FC } from "react";
import useAuth from "@common/hooks/useAuth";
import { isIndividual } from "@common/utils/isIndividual";
import { useRouter } from "next/router";

const RedirectDashboard: FC = () => {
  const { user } = useAuth();
  const userIsIndividual = isIndividual(user.data);
  const router = useRouter();
  const path = router.pathname;
  const isInOrganizerRoute = path.includes("organizer");

  const isIndividualInWrongRoute =
    isInOrganizerRoute && user.data && userIsIndividual;
  const isOrganizerInWrongRoute =
    !isInOrganizerRoute && user.data && !userIsIndividual;

  if (isIndividualInWrongRoute) {
    router.push("/dashboard");
    return null;
  }
  if (isOrganizerInWrongRoute) {
    router.push("/organizer/dashboard");
    return null;
  }

  return null;
};

export default RedirectDashboard;
