import { FC } from "react";
import useAuth from "@common/hooks/useAuth";
import Avatar from "@common/components/Avatar";
import Link from "next/link";
import Cart from "@common/components/Icons/Cart";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import Search from "@common/components/Icons/Search";
import { dashboardLink } from "@common/utils/dashboardLink";

const UserActions: FC = () => {
  const { user } = useAuth();
  const isMediumDevice = useMediaQuery(Device.medium);
  const iconSize = isMediumDevice ? 25 : 20;
  if (!user.data) return null;

  const userIsOrganizer = user.data.role === "organizer";

  return (
    <div className="flex items-center space-x-3 md:space-x-5">
      <Link href={dashboardLink(user.data)}>
        <Avatar size={iconSize} image={user.data.avatar} />
      </Link>
      <Link href={"/events"}>
        <Search size={iconSize} color="white" />
      </Link>
    </div>
  );
};

export default UserActions;
