import { Device, UseMediaQuery } from "@common/typings"
import { useState, useEffect, useCallback } from "react"

const useMediaQuery: UseMediaQuery = (query: Device) => {
  const [matches, setMatches] = useState<boolean>(false)

  const browserWindow = typeof window !== "undefined" ? window : undefined
  const handleSetMatches = useCallback(() => {
    if (!browserWindow) return

    const windowMatch = browserWindow.matchMedia(query).matches

    setMatches(windowMatch)
  }, [browserWindow, query])

  useEffect(() => {
    handleSetMatches()

    browserWindow?.addEventListener("resize", handleSetMatches)

    return () => browserWindow?.removeEventListener("resize", handleSetMatches)
  }, [query, browserWindow, handleSetMatches])

  return matches
}

export default useMediaQuery
