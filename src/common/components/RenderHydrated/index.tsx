import useHydrated from "@common/hooks/useHydrated";
import { FC, PropsWithChildren } from "react";

// A wrapper for useHydrated hook
const RenderHydrated: FC<PropsWithChildren> = ({ children }) => {
  const { hydrated } = useHydrated();

  if (!hydrated) return null;

  return <>{children}</>;
};

export default RenderHydrated;
