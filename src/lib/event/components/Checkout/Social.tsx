import { FC } from "react";
import { SocialProps } from "@lib/event/typings";
import useAlertContext from "@common/hooks/useAlertContext";

const Social: FC<SocialProps> = ({ platform, social, icon }) => {
  const { handleOpenAlert } = useAlertContext();

  if (!social) return null;

  const copySocial = async () => {
    try {
      window.navigator.clipboard.writeText(social);
      handleOpenAlert({
        body: `${platform} social copied to clipboard`,
        title: "Copied",
        type: "success",
      });
    } catch (err) {
      handleOpenAlert({
        body: "Something went wrong",
        title: "Error",
        type: "error",
      });
    }
  };

  return <button onClick={copySocial}>{icon}</button>;
};

export default Social;
