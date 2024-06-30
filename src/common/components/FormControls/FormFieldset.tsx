import { FormFieldsetProps } from "@common/typings"
import { FC, useId } from "react"
import ErrorText from "../ErrorText"
import styles from "./styles.module.css"
import { twMerge } from "tailwind-merge"

const FormFieldset: FC<FormFieldsetProps> = (props) => {
  const id = useId()
  const wrapperClassName = twMerge(
    props.replaceInputWrapperClassName ? props.inputWrapperClassName : null,
    "flex space-x-3",
    props.className
  )

  return (
    <fieldset id={id} className={styles.formfield}>
      {props.label && <label htmlFor={id}>{props.label}</label>}

      <div className={wrapperClassName}>{props.children}</div>
      {props.errors?.map((e, i) => {
        if (e) return <ErrorText key={e + i}>{e}</ErrorText>
        return null
      })}
    </fieldset>
  )
}

export default FormFieldset
