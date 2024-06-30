import { FormTextareaFieldProps } from "@common/typings"
import { forwardRef, useId } from "react"
import styles from "./styles.module.css"
import ErrorText from "../ErrorText"
import { twMerge } from "tailwind-merge"
import Textarea from "./Textarea"

const FormTextAreaField = forwardRef<null, FormTextareaFieldProps>(
  (props, ref) => {
    const {
      label,
      error,
      className,
      children,
      noShadow,
      required,
      ...restProps
    } = props
    const id = useId()
    const c = twMerge(styles.formfield, className)

    return (
      <div className={c}>
        {label && (
          <label htmlFor={id}>
            {label}{" "}
            {required && <span className="text-red-500 font-bold">*</span>}
          </label>
        )}
        <Textarea required={required} id={id} ref={ref} {...restProps} />
        {children}
        <ErrorText>{error}</ErrorText>
      </div>
    )
  }
)

FormTextAreaField.displayName = "FormTextAreaField"

export default FormTextAreaField
