import { FC } from "react";
import { HomeProviderProps } from "@lib/home/typings";
import { HomeContext } from "@lib/home/contexts/Home/Context";

const HomeProvider: FC<HomeProviderProps> = ({ children, ...restProps }) => {
  return (
    <HomeContext.Provider value={restProps}>{children}</HomeContext.Provider>
  );
};

export default HomeProvider;
