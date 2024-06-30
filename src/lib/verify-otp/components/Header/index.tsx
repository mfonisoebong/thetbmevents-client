import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import Image from "next/image";
import { FC } from "react";

const Header: FC = () => {
  const isMediumSize = useMediaQuery(Device.medium);
  const logoSize = isMediumSize ? 140 : 90;

  return (
    <div className="space-y-3">
      <div className="flex justify-center">
        <Image
          src="/images/tbm_logo_sm.png"
          alt="TBM Events logo"
          width={logoSize}
          height={40}
          priority
        />
      </div>
      <h1 className="text-xl md:text-2xl text-center font-bold">Verify OTP</h1>
      <p className="text-center text-gray-500 text-sm md:text-base">
        Please check your mailbox for a secure OTP
      </p>
    </div>
  );
};

export default Header;
