import { FC } from "react";
import Detail from "./Detail";
import Location from "@common/components/Icons/Location";
import Phone from "@common/components/Icons/Phone";
import Mail from "@common/components/Icons/Mail";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";

const Details: FC = () => {
  const isLargeDevice = useMediaQuery(Device.large);
  const iconSize = isLargeDevice ? 26 : 21;

  return (
    <div className="py-5 px-8 space-y-4">
      <Detail
        icon={<Location className="fill-main " size={iconSize} />}
        text="OBA akran, ikeja"
      />
      <Detail
        icon={<Phone className="fill-main " size={iconSize} />}
        text="+234 902 011 3715 / +234 701 340 2680"
      />
      <Detail
        icon={<Mail className="fill-main " size={iconSize} />}
        text="info@thetbmevents.com"
      />
    </div>
  );
};

export default Details;
