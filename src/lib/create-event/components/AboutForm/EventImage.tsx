import ErrorText from "@common/components/ErrorText";
import { fileToDataUrl } from "@common/utils/fileToDataUrl";
import { EventFormType } from "@lib/create-event/utils/eventSchema";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import Image from "next/image";
import { FC } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useFormContext } from "react-hook-form";

const EventImage: FC = () => {
  const {
    formState: { errors },
    setValue,
    setError,
    clearErrors,
    watch,
  } = useFormContext<EventFormType>();

  const imageFile = watch("about.image");
  const MAX_SIZE = 5120000;

  const { getInputProps, open } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    onDropAccepted,
    onDropRejected,
    maxFiles: 1,
    maxSize: MAX_SIZE,
  });

  async function onDropAccepted(files: File[]) {
    const imageFile = files[0];

    const imageUrl = await fileToDataUrl(imageFile);

    setValue("about.image", imageUrl);
    clearErrors("about.image");
  }

  function onDropRejected(fileRejections: FileRejection[]) {
    const error = fileRejections[0].errors[0].message;
    const errorCode = fileRejections[0].errors[0].code;

    if (errorCode === "file-too-large") {
      setError("about.image", { message: "File must not be 5mb" });
      return;
    }

    setError("about.image", { message: error });
  }

  return (
    <div className="space-y-2">
      <input type="file" hidden {...getInputProps()} />
      <label className="font-medium text-base md:text-lg">
        Event Image <span className="text-red-500 font-bold">*</span>
      </label>
      <OverviewCard
        className="border-mainBlue border-[0.15rem] relative"
        theme="light"
      >
        {imageFile && (
          <Image
            unoptimized
            width={200}
            height={200}
            className="absolute w-full h-full z-20 left-0 top-0 object-cover brightness-50"
            src={imageFile}
            alt=""
          />
        )}
        <div className="space-y-3 relative z-30 ">
          <div className="flex justify-center">
            <Image
              src="/images/upload.png"
              alt=""
              width={100}
              height={100}
              className="w-3/12"
            />
          </div>
          <h4 className="text-gray-400 font-semibold text-center text-sm md:text-base">
            Drop your image here or{" "}
            <button type="button" onClick={open} className="text-mainBlue">
              Browse
            </button>
          </h4>
          <p className="text-xs md:text-sm text-center font-semibold">
            Supports JPG, PNG & PJEG
          </p>
          {errors.about?.image?.message && (
            <ErrorText>{errors.about?.image?.message}</ErrorText>
          )}
        </div>
      </OverviewCard>
    </div>
  );
};

export default EventImage;
