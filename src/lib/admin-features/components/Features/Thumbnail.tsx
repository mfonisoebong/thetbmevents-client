import { FC } from "react"
import styles from "./styles.module.css"
import { FeatureFormProps } from "@lib/admin-features/typings"
import { useFormContext } from "react-hook-form"
import { FeaturesFormType } from "@lib/admin-features/utils/featuresSchema"
import ErrorText from "@common/components/ErrorText"
import { useDropzone, Accept } from "react-dropzone"
import { fileToDataUrl } from "@common/utils/fileToDataUrl"
import Image from "next/image"
import { imageWithTimestamp } from "@common/utils/imageWithTimestamp"
const MAX_SIZE = 5120000

const Thumbnail: FC<FeatureFormProps> = ({ index }) => {
  const {
    register,
    watch,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
  } = useFormContext<FeaturesFormType>()
  const image = watch(`features.${index}.thumbnail`)

  const { getInputProps, open } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpg": [".jpg", ".jpeg"],
    },
    maxSize: MAX_SIZE,
    async onDropAccepted(files) {
      const file = await fileToDataUrl(files[0])
      setValue(`features.${index}.thumbnail`, file)
      clearErrors(`features.${index}.thumbnail`)
    },
    onDropRejected(reject) {
      const message = reject[0].errors[0].message
      setError(`features.${index}.thumbnail`, {
        message,
      })
    },
  })

  const featureImage = imageWithTimestamp(image)

  return (
    <>
      <div onClick={open} className={styles.thumbnail}>
        {image && (
          <Image
            src={featureImage}
            alt={""}
            unoptimized
            width={200}
            height={150}
          />
        )}
        <input {...getInputProps()} type="file" hidden />
        <h6 className={"text-5xl font-light"}>+</h6>
        <h4>{image ? "Change" : "Upload"}</h4>
      </div>
      {errors?.features && (
        <ErrorText>{errors?.features[index]?.thumbnail?.message}</ErrorText>
      )}
    </>
  )
}

export default Thumbnail
