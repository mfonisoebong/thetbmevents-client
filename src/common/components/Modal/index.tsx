import { IModalProps, IModalRef } from "@common/typings"
import styles from "./styles.module.css"
import { forwardRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { twMerge } from "tailwind-merge"

const variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
}

const Modal = forwardRef<IModalRef, IModalProps>((props, ref) => {
  const {
    children,
    retain,
    className,
    cardClassName,
    show,
    onExit,
    disableWarningIcon,
    ...restProps
  } = props

  const modalClass = twMerge(styles.modal, className)

  const modalContentClassNames = twMerge(styles.modalcontent, cardClassName)

  return (
    <AnimatePresence onExitComplete={onExit}>
      {show && (
        <motion.div
          variants={variants}
          initial="hidden"
          exit="hidden"
          animate={show ? "visible" : "hidden"}
          transition={{
            duration: 0.6,
            type: "spring",
          }}
        >
          <div className={modalClass} {...restProps}>
            <div className={modalContentClassNames}>{children}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
})

Modal.displayName = "Modal"

export default Modal
