import Button from "@common/components/Button"
import FormField from "@common/components/FormControls/FormField"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  VerificationFormType,
  VerificationSchema,
} from "@lib/verify-otp/utils/verificationSchema"
import { FC } from "react"
import { useForm } from "react-hook-form"
import ResendOtpCode from "./ResendOtpCode"
import { useMutation } from "@tanstack/react-query"
import { verifyOtp } from "@lib/verify-otp/helpers/verifyOtp"
import useAlertContext from "@common/hooks/useAlertContext"
import { useRouter } from "next/router"
import { errorParser } from "@common/utils/errorParser"

const VerificationForm: FC = () => {
  const {
    register,
    watch,
    trigger,
    formState: { errors },
    handleSubmit,
  } = useForm<VerificationFormType>({
    resolver: zodResolver(VerificationSchema),
  })

  const { handleOpenAlert } = useAlertContext()
  const router = useRouter()

  const { mutate, isLoading } = useMutation({
    mutationFn: verifyOtp,
    onSuccess() {
      handleOpenAlert({
        body: "Email verified sucessfully",
        title: "Success",
        type: "success",
      })
      router.push("/")
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      })
    },
  })

  const otpVerification = watch()
  const formIsValid = VerificationSchema.safeParse(otpVerification).success

  const onSubmit = (data: VerificationFormType) => {
    mutate(data)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <FormField
        error={errors.otp?.message}
        {...register("otp", {
          onChange() {
            trigger("otp")
          },
        })}
        placeholder="000000"
      />
      <div className="space-y-2">
        <ResendOtpCode />
        <Button
          disabled={!formIsValid || isLoading}
          type="submit"
          className="w-full"
          size="lg"
          loading={isLoading}
        >
          Submit
        </Button>
      </div>
    </form>
  )
}

export default VerificationForm
