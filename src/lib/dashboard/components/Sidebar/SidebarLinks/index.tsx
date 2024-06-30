import { FC } from "react";
import SidebarLink from "./SidebarLink";
import useAuth from "@common/hooks/useAuth";
import { sidebarLinks } from "@lib/dashboard/constants/sidebarLinks";
import Cookies from "js-cookie";
import IconButton from "@common/components/IconButton";
import DoorOut from "@common/components/Icons/DoorOut";
import { useMutation } from "@tanstack/react-query";
import { loginAsAdmin } from "@lib/dashboard/helpers/loginAsAdmin";
import useAlertContext from "@common/hooks/useAlertContext";
import { errorParser } from "@common/utils/errorParser";
import { useRouter } from "next/router";

const SidebarLinks: FC = () => {
  const { user } = useAuth();
  const router = useRouter();
  const hasAdminId = Cookies.get("admin_id");
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: loginAsAdmin,
    onSuccess(data) {
      router.push("/admin/overview");
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      });
    },
  });

  if (!user.data) return null;
  const links = sidebarLinks(user.data);

  const loginBackAsAdmin = () => {
    mutate();
  };

  return (
    <ul className="space-y-3 md:space-y-5 overflow-y-scroll h-[80%]">
      {hasAdminId && (
        <IconButton
          onClick={loginBackAsAdmin}
          loading={isLoading}
          className={"hover:fill-gold fill-black"}
          icon={<DoorOut size={17} />}
        >
          Login back as admin
        </IconButton>
      )}
      {links.map((s) => (
        <SidebarLink key={s.href} text={s.text} href={s.href} />
      ))}
    </ul>
  );
};

export default SidebarLinks;
