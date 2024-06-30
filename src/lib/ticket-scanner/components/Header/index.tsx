import { FC } from "react";
import IconButton from "@common/components/IconButton";
import Close from "@common/components/Icons/Close";
import { useRouter } from "next/router";

const Header: FC = () => {
  const router = useRouter();

  const toDashboard = () => {
    router.push("/organizer/dashboard");
  };
  return (
    <div className={"relative py-4"}>
      <IconButton
        onClick={toDashboard}
        className={"absolute top-1/4 left-5"}
        icon={<Close color={"white"} size={25} />}
      />
      <h3 className={"font-semibold text-white text-sm text-center"}>
        Scan QR Code
      </h3>
    </div>
  );
};

export default Header;
