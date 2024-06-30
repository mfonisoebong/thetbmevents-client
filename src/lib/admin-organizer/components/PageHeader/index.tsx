import { FC } from "react"
import styles from "./styles.module.css"
import ButtonLink from "@common/components/ButtonLink"
import { useRouter } from "next/router"

const PageHeader: FC = () => {
  const { query } = useRouter()

  return (
    <div className={styles.pageheader}>
      <h3>EVENT ORGANIZER</h3>
      <ButtonLink href={`/admin/login-as/${query?.id}`}>Login as</ButtonLink>
    </div>
  )
}

export default PageHeader
