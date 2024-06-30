import Loader from "@common/components/Icons/Loader"
import useAlertContext from "@common/hooks/useAlertContext"
import { errorParser } from "@common/utils/errorParser"
import { resendOtpCode } from "@lib/verify-otp/helpers/resendOtpCode"
import { useMutation } from "@tanstack/react-query"
import { FC } from "react"

const ResendOtpCode: FC = () => {
  const { handleOpenAlert } = useAlertContext()
  const { mutate, isLoading } = useMutation({
    mutationFn: resendOtpCode,
    onSuccess() {
      handleOpenAlert({
        body: "OTP resemt successfully! Check your email for the code",
        title: "Success",
        type: "success",
      })
    },
    onError(err) {
      handleOpenAlert({
        body: errorParser(err),
        title: "Error",
        type: "error",
      })
    },
  })

  const sendOtp = () => mutate()

  if (isLoading) return <Loader color="black" size={17} />

  return (
    <p className="text-xs md:text-sm">
      <span>Didn&apos;t get the OTP code?</span>{" "}
      <button
        onClick={sendOtp}
        className="underline disabled:opacity-60"
        type="button"
      >
        Click here to resend it
      </button>
    </p>
  )
}

export default ResendOtpCode
