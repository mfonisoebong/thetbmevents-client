import { FC, PropsWithChildren } from "react"
import Sidebar from "../Sidebar"
import Container from "@common/components/Container"
import styles from "./styles.module.css"
import Notifications from "../Notifications"

const MainSection: FC<PropsWithChildren> = ({ children }) => {
  return (
    <main className={styles.main}>
      <Sidebar />

      <div className={styles.wrapper}>
        <Container className=" space-y-7">{children}</Container>
      </div>
      <Notifications />
    </main>
  )
}

export default MainSection
