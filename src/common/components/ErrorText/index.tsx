import { FC, PropsWithChildren } from "react";
import ExclamationCircle from "../Icons/ExclamationCircle";

const ErrorText: FC<PropsWithChildren> = ({ children }) => {
  if (!children) return null;

  return (
    <p className="flex text-xs items-center space-x-2 text-red-500">
      <ExclamationCircle size={17} className="stroke-red-500 fill-red-500" />
      <span>{children}</span>
    </p>
  );
};
export default ErrorText;
