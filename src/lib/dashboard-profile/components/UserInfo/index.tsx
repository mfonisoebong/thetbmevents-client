import { FC } from "react";
import styles from "./styles.module.css";
import Avatar from "@common/components/Avatar";
import useAuth from "@common/hooks/useAuth";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import { userNameFormatter } from "@common/utils/userNameFormatter";
import useToggle from "@common/hooks/useToggle";

const UserInfo: FC = () => {
  const { user } = useAuth();
  const isLargeDevice = useMediaQuery(Device.large);
  const isMediumDevice = useMediaQuery(Device.medium);
  const avatarSize = isLargeDevice ? 68 : isMediumDevice ? 50 : 40;
  const { toggle: isHover, handleToggle } = useToggle(false);

  if (!user.data) return null;

  return (
    <div className={styles.userinfo}>
      <div className={styles.brief}>
        <Avatar size={avatarSize} image={user.data.avatar} />
        <div className={"space-y-1"}>
          <h6>{userNameFormatter(user.data)}</h6>
          <p>{user.data.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
