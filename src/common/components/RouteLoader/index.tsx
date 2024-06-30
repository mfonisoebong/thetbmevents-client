import { useRouter } from "next/router"
import { FC, useEffect, useState } from "react"

import { RouteLoaderProps } from "@common/typings"
import Loader from "./Loader"

const RouteLoader: FC<RouteLoaderProps> = ({ children, disabled }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleChangeStart = () => {
      setLoading(true)
    }

    const handleChangeComplete = () => {
      setLoading(false)
    }

    router.events.on("routeChangeStart", handleChangeStart)
    router.events.on("routeChangeComplete", handleChangeComplete)

    return () => {
      router.events.off("routeChangeStart", handleChangeStart)
      router.events.off("routeChangeComplete", handleChangeComplete)
    }
  }, [router])

  if (loading) {
    return <Loader />
  }
  if (disabled) {
    return <>{children}</>
  }

  return <>{children}</>
}

export default RouteLoader
