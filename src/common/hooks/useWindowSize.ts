import { WindowSize } from "@common/typings"
import { useState, useEffect, useCallback } from "react"

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    height: 0,
    width: 0,
  })

  const browserWindow = typeof window !== "undefined" ? window : undefined
  const handleSetMatches = useCallback(() => {
    if (!browserWindow) return

    setWindowSize(() => ({
      height: browserWindow.innerHeight,
      width: browserWindow.innerWidth,
    }))
  }, [browserWindow])

  useEffect(() => {
    handleSetMatches()

    browserWindow?.addEventListener("resize", handleSetMatches)

    return () => browserWindow?.removeEventListener("resize", handleSetMatches)
  }, [browserWindow, handleSetMatches])

  return windowSize
}

export default useWindowSize
