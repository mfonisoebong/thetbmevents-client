import { FC, useState } from "react";
import Avatar from "@common/components/Avatar";
import { useDropzone } from "react-dropzone";
import { fileToDataUrl } from "@common/utils/fileToDataUrl";
import useAuth from "@common/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { uploadAvatar } from "@lib/dashboard-edit-profile/helpers/uploadAvatar";
import useAlertContext from "@common/hooks/useAlertContext";
import AvatarActions from "@lib/dashboard-edit-profile/components/EditAvatar/AvatarActions";
import Loader from "@common/components/Icons/Loader";
import { removeAvatar } from "@lib/dashboard-edit-profile/helpers/removeAvatar";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";

const EditAvatar: FC = () => {
  const MAX_SIZE = 5120000;
  const { user } = useAuth();
  const isLargeDevice = useMediaQuery(Device.large);
  const avatarSize = isLargeDevice ? 150 : 100;
  const [image, setImage] = useState<string | null>(null);
  const { getInputProps, open } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: 1,
    maxSize: MAX_SIZE,
    onDropAccepted,
  });
  const saveDisabled = image === null;
  const { handleOpenAlert } = useAlertContext();
  const { mutate, isLoading: isUploading } = useMutation({
    mutationFn: uploadAvatar,
    onSuccess,
    onError,
  });

  const { mutate: remove, isLoading: isRemovingAvatar } = useMutation({
    mutationFn: removeAvatar,
    onSuccess,
    onError,
  });

  function onSuccess() {
    handleOpenAlert({
      body: "Avatar updated successfully",
      type: "success",
      title: "Success",
    });
    setImage(null);
    user.refetch();
  }

  function onError() {
    handleOpenAlert({
      body: "An error occured",
      type: "error",
      title: "Failed",
    });
  }

  async function onDropAccepted(files: File[]) {
    const dataUrl = await fileToDataUrl(files[0]);

    setImage(() => dataUrl);
  }

  const upload = () => {
    if (!image) return;

    mutate(image);
  };

  const removeUserAvatar = () => {
    if (!user.data?.avatar) {
      setImage(null);
      return;
    }
    remove();
  };

  return (
    <div className={"space-y-2  mb-8"}>
      <div className={"flex justify-center mt-5 relative"}>
        <input type="file" {...getInputProps()} hidden />
        <Avatar image={image ?? user.data?.avatar} size={avatarSize} />
      </div>

      {isUploading || isRemovingAvatar ? (
        <Loader size={22} className={"mx-auto"} color={"black"} />
      ) : (
        <AvatarActions
          saveDisabled={saveDisabled}
          onChange={open}
          upload={upload}
          remove={removeUserAvatar}
        />
      )}
    </div>
  );
};

export default EditAvatar;
