import { useRouter } from "next/router"
import { FC, PropsWithChildren } from "react"

const CheckDevice: FC<PropsWithChildren> = ({ children }) => {
  const device = navigator.userAgent
  const router = useRouter()
  const productiionMode = process.env.NODE_ENV === "production"
  const regex =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|Tablet|tablet/i

  const isMobileDevice = regex.test(device)

  if (!isMobileDevice && productiionMode) {
    router.push("/events/scan/device-not-allowed")
  }

  return <>{children}</>
}

export default CheckDevice
