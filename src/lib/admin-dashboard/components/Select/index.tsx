import { FC, useState } from "react"
import styles from "./styles.module.css"
import { SelectProps } from "@lib/admin-dashboard/typings"
import ArrowDown from "@common/components/Icons/ArrowDown"
import Options from "@lib/admin-dashboard/components/Select/Options"
import useToggle from "@common/hooks/useToggle"
import { twMerge } from "tailwind-merge"
const Select: FC<SelectProps> = (props) => {
  const { toggle: showOptions, handleToggle } = useToggle(false)

  const optionDisplay = props.selectedOption
    ? props.selectedOption
    : props.optionsDisplay
    ? props.optionsDisplay[0]
    : props.options[0]

  const invalidOptions =
    props.optionsDisplay && props.optionsDisplay.length !== props.options.length
  if (invalidOptions) {
    throw new Error("Options must have equal length")
  }

  const c = twMerge(styles.select, props.className)

  return (
    <div className={c}>
      <button className={styles.selectbutton} onClick={handleToggle}>
        <p>{optionDisplay}</p>
        <ArrowDown size={11} />
      </button>
      {showOptions && <Options {...props} onClickAway={handleToggle} />}
    </div>
  )
}

export default Select
