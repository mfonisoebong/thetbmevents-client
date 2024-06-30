import { TextAreaProps } from "@common/typings"
import { FC, forwardRef } from "react"
import { twMerge } from "tailwind-merge"
import styles from "./styles.module.css"

const Textarea = forwardRef<null, TextAreaProps>(
  ({ className, ...restProps }, ref) => {
    const c = twMerge(styles.textarea, className)

    return <textarea ref={ref} className={c} {...restProps}></textarea>
  }
)

Textarea.displayName = "Textarea"

export default Textarea
