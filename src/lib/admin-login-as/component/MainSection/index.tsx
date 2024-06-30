import Avatar from "@common/components/Avatar";
import Button from "@common/components/Button";
import { logoutUser } from "@common/helpers/logoutUser";
import useAlertContext from "@common/hooks/useAlertContext";
import useAuth from "@common/hooks/useAuth";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import { getUserToken } from "@lib/admin-login-as/helpers/getUserToken";
import useOrganizer from "@lib/admin-organizer/hooks/useOrganizer";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { FC } from "react";

const MainSection: FC = () => {
  const router = useRouter();
  const isLargeDevice = useMediaQuery(Device.large);
  const avatarSize = isLargeDevice ? 120 : 100;
  const { data: organizer } = useOrganizer();
  const { user } = useAuth();
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading } = useMutation({
    mutationFn: getUserToken,
    async onSuccess(data) {
      const token = Cookies.get("access_token_enocded");
      await logoutUser(token);
      Cookies.remove("access_token_enocded");
      Cookies.set("admin_id", user.data?.id ?? "");
      user.remove();
      router.push(`/authenticate?token=${data.access_token}`);
    },
    onError() {
      handleOpenAlert({
        body: "An error occured",
        title: "Error",
        type: "error",
      });
    },
  });

  const loginAs = () => {
    mutate(organizer?.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Avatar image={organizer?.avatar} size={avatarSize} />
      </div>

      <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-center">
        You are about to login as:
      </h1>
      <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-center">
        {organizer?.name}
      </h3>
      <Button
        onClick={loginAs}
        loading={isLoading}
        disabled={isLoading}
        size="lg"
        className="mx-auto px-20 md:px-24"
      >
        Continue
      </Button>
    </div>
  );
};

export default MainSection;
