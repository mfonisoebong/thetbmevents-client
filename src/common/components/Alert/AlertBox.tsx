import { alertVariants } from "@common/constants/alertVariants"
import useAlertContext from "@common/hooks/useAlertContext"
import { AlertBoxProps, Device } from "@common/typings"
import { FC, forwardRef, useCallback, useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
import CheckmarkCircle from "../Icons/CheckmarkCircle"
import AlertCircle from "../Icons/AlertCircle"
import InfoCircle from "../Icons/InfoCircle"
import Close from "../Icons/Close"
import IconButton from "../IconButton"
import { motion, Variants } from "framer-motion"
import styles from "./styles.module.css"
import useMediaQuery from "@common/hooks/useMediaQuery"

const variants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
}

const AlertBox = forwardRef<null, AlertBoxProps>(
  ({ body, title, type, index, close, className }, ref) => {
    const { closeAlert } = useAlertContext()
    const [isHover, setIsHover] = useState(false)
    const isMediumDevice = useMediaQuery(Device.medium)
    const iconSize = isMediumDevice ? 30 : 24
    const handleClose = useCallback(() => {
      closeAlert(index)
    }, [closeAlert, index])

    const toggleIsHover = () => {
      setIsHover((state) => !state)
    }
    const iconColor =
      type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#3b82f6"

    const c = twMerge(styles.alertbox, alertVariants[type], className)

    useEffect(() => {
      const timeout = setTimeout(() => {
        handleClose()
      }, 7000)

      return () => clearTimeout(timeout)
    }, [handleClose])

    return (
      <motion.div
        onMouseEnter={toggleIsHover}
        onMouseLeave={toggleIsHover}
        className={c}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        layout
      >
        <div className="w-[3%]">
          {!isHover ? (
            <>
              {type === "success" && (
                <CheckmarkCircle color={iconColor} size={iconSize} />
              )}
              {type === "error" && (
                <AlertCircle color={iconColor} size={iconSize} />
              )}
              {type === "info" && (
                <InfoCircle color={iconColor} size={iconSize} />
              )}
            </>
          ) : (
            <IconButton
              onClick={close ?? handleClose}
              icon={<Close color={iconColor} size={iconSize} />}
            />
          )}
        </div>
        <div>
          <h6 className="font-semibold">{title}</h6>
          <p>{body}</p>
        </div>
      </motion.div>
    )
  }
)

AlertBox.displayName = "AlertBox"

export default AlertBox
