import { FC, PropsWithChildren } from "react";
import useEvent from "@lib/event/hooks/useEvent";
import { useRouter } from "next/router";
import Loader from "@common/components/RouteLoader/Loader";

const Index: FC<PropsWithChildren> = ({ children }) => {
  const event = useEvent();
  const router = useRouter();

  if (event.isLoading) return <Loader />;

  if (!event.data) {
    router.push("/404");
    return null;
  }

  return <>{children}</>;
};

export default Index;
