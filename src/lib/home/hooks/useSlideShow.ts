import { DragHandlers, PanInfo } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import { SWIPE_CONFIDENCE_THERESHOLD } from "../constants/slideShow"
import { UseSlideShow } from "../typings"
import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"

const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

const useSlideShow: UseSlideShow = (pages) => {
  const [[page, direction], setPage] = useState([0, 0])
  const lgScreenSize = useMediaQuery(Device.large)
  const mdScreenSize = useMediaQuery(Device.medium)
  const smScreenSize = useMediaQuery(Device.small)

  const paginate = (newDirection: number) => {
    const newPage = page + newDirection
    const cannotPaginate = newPage + 1 > pages || newPage === -1
    if (cannotPaginate) {
      return
    }

    setPage([newPage, newDirection])
  }

  const toPage = useCallback(
    (num: number) => {
      const newPage = num - page
      if (newPage < 0) {
        setPage([num, -1])
        return
      }
      setPage([num, 1])
    },
    [page]
  )

  const onDragEnd: DragHandlers["onDragEnd"] = (e, { offset, velocity }) => {
    const swipe = swipePower(offset.x, velocity.x)

    if (swipe < -SWIPE_CONFIDENCE_THERESHOLD) {
      paginate(1)
    } else if (swipe > SWIPE_CONFIDENCE_THERESHOLD) {
      paginate(-1)
    }
  }

  useEffect(() => {
    const newPage = pages - 1 === page ? 0 : page + 1
    const interval = setInterval(() => {
      toPage(newPage)
    }, 4000)

    return () => clearInterval(interval)
  }, [toPage, page, pages])

  const resetPage = useCallback(() => {
    setPage([0, 0])
  }, [])

  useEffect(() => {
    resetPage()
  }, [resetPage, lgScreenSize, mdScreenSize, smScreenSize])

  return {
    page,
    direction,
    paginate,
    toPage,
    onDragEnd,
  }
}

export default useSlideShow
