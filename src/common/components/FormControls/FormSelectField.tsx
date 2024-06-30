import { forwardRef, useId } from "react"
import { FormSelectFieldProps } from "@common/typings"
import Select from "./Select"
import ErrorText from "../ErrorText"
import styles from "./styles.module.css"
import { twMerge } from "tailwind-merge"

const FormSelectField = forwardRef<null, FormSelectFieldProps>((props, ref) => {
  const { label, error, className, type, noShadow, required, ...restProps } =
    props
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

      <Select required={required} id={id} ref={ref} {...restProps} />

      <ErrorText>{error}</ErrorText>
    </div>
  )
})

FormSelectField.displayName = "FormSelectField"

export default FormSelectField
