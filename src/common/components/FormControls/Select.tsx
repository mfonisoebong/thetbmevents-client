import { SelectProps } from "@common/typings"
import { forwardRef } from "react"
import styles from "./styles.module.css"

const Select = forwardRef<null, SelectProps>((props, ref) => {
  const { className, wrapperClassName, icon, iconPosition, ...restProps } =
    props
  const baseStyles = icon ? styles.selectwithicon : styles.select
  const iconPositionClass =
    iconPosition === "left" ? styles.iconleft : styles.iconright
  return (
    <div className={`relative ${wrapperClassName}`}>
      <span className={iconPositionClass}>{icon}</span>
      <select
        ref={ref}
        className={`${baseStyles} ${className}`}
        {...restProps}
      />
    </div>
  )
})

Select.displayName = "Select"

export default Select
