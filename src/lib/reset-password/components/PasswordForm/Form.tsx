import { zodResolver } from "@hookform/resolvers/zod"
import { FC } from "react"
import { useForm } from "react-hook-form"
import {
  ResePasswordForm,
  ResetPasswordSchema,
} from "../../utils/resetPasswordSchema"
import FormField from "@common/components/FormControls/FormField"
import Button from "@common/components/Button"
import { useMutation } from "@tanstack/react-query"
import { resetPassword } from "@lib/reset-password/helpers/resetPassword"
import useAlertContext from "@common/hooks/useAlertContext"
import { errorParser } from "@common/utils/errorParser"
import { useRouter } from "next/router"

const Form: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResePasswordForm>({
    resolver: zodResolver(ResetPasswordSchema),
  })
  const router = useRouter()
  const { handleOpenAlert } = useAlertContext()
  const { mutate, isLoading } = useMutation({
    mutationFn: resetPassword,
    onSuccess() {
      handleOpenAlert({
        body: "Password reset successfully",
        title: "Success",
        type: "success",
      })
      router.push("/login")
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      })
    },
  })

  const onSubmit = (data: ResePasswordForm) => {
    const tokenId = router.query?.id as string

    if (!tokenId) return

    mutate({
      data,
      token: tokenId,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <FormField
          {...register("password")}
          error={errors.password?.message}
          label={"New Password"}
          type="password"
        />
        <FormField
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          label={"Confirm Password"}
          type="password"
        />
      </div>
      <Button
        loading={isLoading}
        className="w-full mt-8"
        size="lg"
        type="submit"
      >
        Submit
      </Button>
    </form>
  )
}

export default Form
