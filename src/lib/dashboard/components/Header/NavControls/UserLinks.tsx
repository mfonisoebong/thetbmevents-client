import Avatar from "@common/components/Avatar";
import ArrowDown from "@common/components/Icons/ArrowDown";
import useAuth from "@common/hooks/useAuth";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device, UserRole } from "@common/typings";
import { isIndividual } from "@common/utils/isIndividual";
import { FC } from "react";
import { isAdmin } from "@common/utils/isAdmin";
import { capitalizeFirstLetter } from "@common/utils/capitalizeFirstLetter";

const UserLinks: FC = () => {
  const { user } = useAuth();
  const isMediumDevice = useMediaQuery(Device.medium);
  const avatarSize = isMediumDevice ? 50 : 30;
  const iconSize = isMediumDevice ? 17 : 14;
  const name =
    isIndividual(user.data) || isAdmin(user.data)
      ? `${user.data.first_name} ${user.data.last_name}`
      : user.data?.buisness_name;

  const userRole: Record<UserRole, string> = {
    organizer: "Event organizer",
    individual: "User",
    admin: capitalizeFirstLetter(user.data?.admin_role ?? ""),
  };

  if (!user.data) return null;

  return (
    <div className="flex items-center space-x-3">
      <Avatar size={avatarSize} image={user.data?.avatar} />
      <div>
        <h6 className="text-[0.65rem] md:text-sm font-medium">{name}</h6>
        <h6 className="text-[0.65rem] md:text-sm text-gray-400 font-medium">
          {userRole[user.data.role]}
        </h6>
      </div>
      <ArrowDown size={iconSize} />
    </div>
  );
};

export default UserLinks;
