import { InputProps } from "@common/typings"
import { HTMLInputTypeAttribute, forwardRef, useEffect, useState } from "react"
import styles from "./styles.module.css"
import Eye from "../Icons/Eye"
import EyeOff from "../Icons/EyeOff"
import { twMerge } from "tailwind-merge"

const Input = forwardRef<null, InputProps>((props, ref) => {
  const {
    className,
    type,
    wrapperClassName,
    iconPosition,
    icon,
    ...restProps
  } = props
  const baseStyles = icon ? styles.inputwithicon : styles.input
  const iconPositionClass =
    iconPosition === "left" ? styles.iconleft : styles.iconright
  const [inputType, setInputType] = useState<HTMLInputTypeAttribute>()
  const isPasswordType = type === "password"
  const c = twMerge(baseStyles, className)
  const toggleInputType = () => {
    if (inputType === "password") {
      setInputType("text")
      return
    }

    setInputType("password")
  }

  useEffect(() => {
    setInputType(() => props.type)
  }, [props.type])

  return (
    <div className={`relative ${wrapperClassName}`}>
      <span className={iconPositionClass}>{icon}</span>
      <input ref={ref} type={inputType} className={c} {...restProps} />
      {isPasswordType && (
        <button
          type="button"
          onClick={toggleInputType}
          className="absolute top-1/3 right-3 cursor-pointer"
        >
          {inputType === "text" ? (
            <EyeOff color="gray" size={18} />
          ) : (
            <Eye color="gray" size={18} />
          )}
        </button>
      )}
    </div>
  )
})

Input.displayName = "Input"

export default Input
