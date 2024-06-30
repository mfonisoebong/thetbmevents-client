import IconButton from "@common/components/IconButton";
import Bell from "@common/components/Icons/Bell";
import Gear from "@common/components/Icons/Gear";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import useSidebarContext from "@lib/dashboard/hooks/useSidebarContext";
import { FC } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import useAuth from "@common/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import Loader from "@common/components/Icons/Loader";
import DoorOut from "@common/components/Icons/DoorOut";
import styles from "@lib/dashboard/components/Sidebar/styles.module.css";

const NavLinks: FC = () => {
  const isMediumDevice = useMediaQuery(Device.medium);
  const iconSize = isMediumDevice ? 20 : 15;
  const router = useRouter();
  const { logout } = useAuth();

  const { mutate, isLoading } = useMutation({
    mutationFn: logout,
  });

  const logoutAction = () => {
    mutate();
  };
  const toProfile = () => router.push("/dashboard/profile");

  return (
    <div className="flex items-center space-x-2">
      <Link
        title={"Notifications"}
        className="fill-gray-700"
        href={"/dashboard/notifications"}
      >
        <Bell size={iconSize} />
      </Link>

      <IconButton
        onClick={toProfile}
        className="fill-gray-700"
        icon={<Gear size={iconSize} />}
        variant="fill"
        title={"Settings"}
      />
      <IconButton
        title={"Logout"}
        onClick={logoutAction}
        disabled={isLoading}
        icon={isLoading ? <Loader color="black" /> : <DoorOut color="black" />}
        className={styles.authlink}
      />
    </div>
  );
};

export default NavLinks;
