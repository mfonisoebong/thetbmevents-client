import { FC } from "react"
import ArrowLeft from "@common/components/Icons/ArrowLeft"
import IconButton from "@common/components/IconButton"
import styles from "./styles.module.css"
import { useRouter } from "next/router"

const GoBack: FC = () => {
  const router = useRouter()

  const resetFilter = () => {
    router.push(
      {
        query: null,
      },
      undefined,
      {
        scroll: false,
        shallow: true,
      }
    )
  }

  return (
    <div>
      <IconButton
        onClick={resetFilter}
        variant="stroke"
        className={styles.goback}
        icon={<ArrowLeft />}
      >
        Go back
      </IconButton>
    </div>
  )
}

export default GoBack
