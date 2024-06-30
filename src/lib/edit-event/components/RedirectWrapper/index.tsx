import { FC, PropsWithChildren } from "react";
import useUserEvent from "@lib/edit-event/hooks/useUserEvent";
import { useRouter } from "next/router";

const RedirectWrapper: FC<PropsWithChildren> = ({ children }) => {
  const event = useUserEvent();
  const router = useRouter();

  if (!event.isLoading && !event.data) {
    router.push("/404");
  }

  return <>{children}</>;
};

export default RedirectWrapper;
