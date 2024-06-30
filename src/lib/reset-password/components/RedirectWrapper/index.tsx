import { FC, PropsWithChildren } from "react";
import useAuth from "@common/hooks/useAuth";
import { useRouter } from "next/router";

const RedirectWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth();
  const loggedIn = user.data && !user.isLoading;
  const router= useRouter()

  if(loggedIn){
    router.push('/')
  }
  

  return <>{children}</>;
};

export default RedirectWrapper;
