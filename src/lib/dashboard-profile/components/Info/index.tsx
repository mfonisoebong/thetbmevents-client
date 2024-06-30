import { InfoProps } from "@lib/dashboard-profile/typings";
import { FC } from "react";

const Info: FC<InfoProps> = ({ title, value = "Not assigned" }) => {
  return (
    <div className="space-y-2">
      <h3>{title}</h3>
      <h6>{value ?? "Nothing yet"}</h6>
    </div>
  );
};

export default Info;
