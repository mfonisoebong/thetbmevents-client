import { Children, FC, isValidElement } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { SlideShowProps } from "../../../lib/home/typings"
import IconButton from "@common/components/IconButton"
import ArrowLeft from "@common/components/Icons/ArrowLeft"
import ArrowRight from "@common/components/Icons/ArrowRight"
import {
  DRAG_CONSTRAINTS,
  variants,
} from "../../../lib/home/constants/slideShow"
import useSlideShow from "../../../lib/home/hooks/useSlideShow"
import PageIndicator from "./PageIndicator"
import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"
import { sliceIntoChunks } from "@common/utils/sliceIntoChunks"
import styles from "./styles.module.css"

export const SlideShow: FC<SlideShowProps> = ({
  children,
  iconsColor,
  height,
  itemsPerPage = 1,
}) => {
  const iconColor = iconsColor ?? "white"
  const iconSize = useMediaQuery(Device.medium) ? 26 : 20
  const childrenElements = Children.map(children, (child) => {
    if (isValidElement(child)) {
      return <child.type {...child.props} />
    }
    return <></>
  })

  const parsedChildren =
    typeof childrenElements === "object" && childrenElements !== null
      ? childrenElements
      : []

  const childrenChunks = sliceIntoChunks(parsedChildren, itemsPerPage)

  const { direction, onDragEnd, page, paginate, toPage } = useSlideShow(
    childrenChunks.length
  )

  const isNotInFirstPage = page !== 0
  const isNotInLastPage = page !== childrenChunks.length - 1

  return (
    <>
      <div
        style={{
          height,
        }}
        className={styles.wrapper}
      >
        <AnimatePresence mode="popLayout" custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            className={styles.slider}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
            }}
            drag="x"
            dragConstraints={DRAG_CONSTRAINTS}
            dragElastic={1}
            onDragEnd={onDragEnd}
          >
            {childrenChunks[page] &&
              childrenChunks[page].map((c) => (c ? c : null))}
          </motion.div>
        </AnimatePresence>

        {isNotInFirstPage && (
          <IconButton
            icon={<ArrowLeft color={iconColor} size={iconSize} />}
            className={styles.lefticon}
            onClick={() => paginate(-1)}
          />
        )}
        {isNotInLastPage && (
          <IconButton
            variant="stroke"
            icon={<ArrowRight color={iconColor} size={iconSize} />}
            className={styles.righticon}
            onClick={() => paginate(1)}
          />
        )}
      </div>
      <PageIndicator
        toPage={toPage}
        items={childrenChunks.length}
        active={page}
      />
    </>
  )
}

export default SlideShow
