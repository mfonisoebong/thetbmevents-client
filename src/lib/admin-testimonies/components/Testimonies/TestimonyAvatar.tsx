import { FC } from "react";
import { FeatureFormProps } from "@lib/admin-features/typings";
import { useFormContext } from "react-hook-form";
import { TestimoniesFormType } from "@lib/admin-testimonies/utils/testimoniesSchema";
import Avatar from "@common/components/Avatar";
import IconButton from "@common/components/IconButton";
import PencilOutline from "@common/components/Icons/PencilOutline";
import { useDropzone } from "react-dropzone";
import { fileToDataUrl } from "@common/utils/fileToDataUrl";
import ErrorText from "@common/components/ErrorText";
import { imageWithTimestamp } from "@common/utils/imageWithTimestamp";

const TestimonyAvatar: FC<FeatureFormProps> = ({ index }) => {
  const {
    watch,
    setValue,
    formState: { errors },
    setError,
    clearErrors,
  } = useFormContext<TestimoniesFormType>();
  const avatar = watch(`testimonies.${index}.avatar`);
  const { getInputProps, open } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
    },
    async onDropAccepted(files) {
      const dataUrl = await fileToDataUrl(files[0]);
      setValue(`testimonies.${index}.avatar`, dataUrl);
      clearErrors(`testimonies.${index}.avatar`);
    },
    onDropRejected(reject) {
      const message = reject[0].errors[0].message;
      setError(`testimonies.${index}.avatar`, {
        message,
      });
    },
  });

  const avatarImage = imageWithTimestamp(avatar);

  return (
    <div className={"flex flex-col space-y-2 items-center"}>
      <Avatar size={60} image={avatar ? avatarImage : "/images/avatar.svg"} />
      <input type="file" hidden {...getInputProps()} />
      <IconButton
        onClick={open}
        className={"text-xs"}
        icon={<PencilOutline size={12} color={"black"} />}
      >
        Change
      </IconButton>
      {errors?.testimonies && (
        <ErrorText>{errors?.testimonies[index]?.avatar?.message}</ErrorText>
      )}
    </div>
  );
};

export default TestimonyAvatar;
