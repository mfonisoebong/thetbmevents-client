import { FormHeaderProps } from "@lib/login/typings"
import { FC } from "react"
import styles from "./styles.module.css"

const FormHeader: FC<FormHeaderProps> = ({ subTitle, title }) => {
  return (
    <div className={styles.formheader}>
      <h2>{title}</h2>
      {subTitle && <h4>{subTitle}</h4>}
    </div>
  )
}

export default FormHeader
