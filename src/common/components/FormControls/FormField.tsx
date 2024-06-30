import { forwardRef, useId } from "react"
import { FormFieldProps } from "@common/typings"
import Input from "./Input"
import ErrorText from "../ErrorText"
import styles from "./styles.module.css"
import { twMerge } from "tailwind-merge"

const FormField = forwardRef<null, FormFieldProps>((props, ref) => {
  const {
    label,
    error,
    className,
    type,
    children,
    onClick,
    noShadow,
    required,
    ...restProps
  } = props
  const id = useId()
  const c = twMerge(styles.formfield, className)

  return (
    <div className={c} onClick={onClick}>
      {label && (
        <label htmlFor={id}>
          {label}{" "}
          {required && <span className="text-red-500 font-bold">*</span>}
        </label>
      )}
      <Input required={required} type={type} id={id} ref={ref} {...restProps} />
      {children}
      <ErrorText>{error}</ErrorText>
    </div>
  )
})

FormField.displayName = "FormField"

export default FormField
