import { FC, PropsWithChildren } from "react";
import useTicket from "@lib/dashboard-ticket/hooks/useTicket";
import { useRouter } from "next/router";
import Loader from "@common/components/RouteLoader/Loader";

const RedirectWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { data: ticket, isLoading } = useTicket();

  const router = useRouter();

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && !ticket) {
    router.push("/404");
  }

  return <>{children}</>;
};

export default RedirectWrapper;
