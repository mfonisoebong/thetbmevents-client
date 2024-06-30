import Button from "@common/components/Button"
import useAlertContext from "@common/hooks/useAlertContext"
import { compareObjects } from "@common/utils/compareObjects"
import { errorParser } from "@common/utils/errorParser"
import { updateSlides } from "@lib/admin-slider/helpers/updateSlides"
import useSlidersContext from "@lib/admin-slider/hooks/useSlidersContext"
import useSlides from "@lib/admin-slider/hooks/useSlides"
import { SlidesSchema } from "@lib/admin-slider/utils/slideSchema"
import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { FC } from "react"

const Actions: FC = () => {
  const { slides } = useSlidersContext()
  const { refetch, data: defaultSlides } = useSlides()
  const router = useRouter()
  const validSlides = SlidesSchema.safeParse(slides)
  const slidesAreValid = validSlides.success
  const slidesAreSame = compareObjects(slides, defaultSlides ?? {}).isSame
  const { handleOpenAlert } = useAlertContext()
  const { mutate, isLoading } = useMutation({
    mutationFn: updateSlides,
    onSuccess() {
      handleOpenAlert({
        body: "Slides updated successfully",
        title: "Success",
        type: "success",
      })
      refetch()
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Failed",
        type: "error",
      })
    },
  })

  const save = () => {
    if (!slidesAreValid) return

    mutate(slides)
  }

  return (
    <div className="flex items-center justify-center space-x-5">
      <Button loading={isLoading} onClick={router.back} variant="outline">
        Back
      </Button>
      <Button
        loading={isLoading}
        onClick={save}
        disabled={!slidesAreValid || slidesAreSame}
      >
        Save
      </Button>
    </div>
  )
}

export default Actions
