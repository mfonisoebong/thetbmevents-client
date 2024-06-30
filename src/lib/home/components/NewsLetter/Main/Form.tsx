import Button from "@common/components/Button"
import FormField from "@common/components/FormControls/FormField"
import Cirlce from "@common/components/Icons/Circle"
import Mail from "@common/components/Icons/Mail"
import useAlertContext from "@common/hooks/useAlertContext"
import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"
import { errorParser } from "@common/utils/errorParser"
import { zodResolver } from "@hookform/resolvers/zod"
import { signupForNewsletter } from "@lib/home/helpers/signupForNewsletter"
import {
  NewsletterForm,
  NewsletterSchema,
} from "@lib/home/utils/newsletterSchema"
import { useMutation } from "@tanstack/react-query"
import { FC } from "react"
import { useForm } from "react-hook-form"

const Form: FC = () => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<NewsletterForm>({
    resolver: zodResolver(NewsletterSchema),
  })
  const { handleOpenAlert } = useAlertContext()
  const isMediumSize = useMediaQuery(Device.medium)
  const formSize = isMediumSize ? "4.4rem" : "3.5rem"
  const { isLoading, mutate } = useMutation({
    mutationFn: signupForNewsletter,
    onSuccess() {
      handleOpenAlert({
        body: "Thanks for signing up for our newsletter",
        title: "Success",
        type: "success",
      })
      reset()
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      })
    },
  })

  const onFormSubmit = (data: NewsletterForm) => {
    mutate(data)
  }

  return (
    <form
      onSubmit={handleSubmit(onFormSubmit)}
      className="w-full lg:w-1/2 space-y-2 relative"
    >
      <div className="flex relative justify-center">
        <FormField
          type="email"
          error={errors.email?.message}
          {...register("email")}
          placeholder="Enter your email address"
          className="space-y-1 w-11/12 mr-auto"
          style={{
            height: formSize,
            paddingRight: isMediumSize ? 130 : 45,
          }}
        >
          <small className="flex space-x-2 items-center">
            <Cirlce color="black" size={4} />
            <span>Don’t worry you’ll not be spammed</span>
          </small>
        </FormField>

        <Button
          style={{
            height: formSize,
            borderRadius: 18,
          }}
          loading={isLoading}
          size="lg"
          className="absolute right-0 min-w-[6rem]"
        >
          <Mail color="white" size={20} />

          <span className="hidden md:block">Subscribe</span>
        </Button>
      </div>
    </form>
  )
}

export default Form
