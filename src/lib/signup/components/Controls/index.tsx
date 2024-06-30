import ButtonLink from "@common/components/ButtonLink"
import { FC } from "react"
import styles from "./styles.module.css"
import Button from "@common/components/Button"
import { useRouter } from "next/router"
import useAccountSelectionContext from "@lib/signup/hooks/useAccountSelectionContext"

const Controls: FC = () => {
  const router = useRouter()
  const { account } = useAccountSelectionContext()
  const proceedLink = `/signup/${account}`

  return (
    <div className={styles.buttoncontainer}>
      <ButtonLink href={proceedLink} size="lg">
        Proceed
      </ButtonLink>
      <Button onClick={router.back} variant="outline" size="lg">
        Go Back
      </Button>
    </div>
  )
}

export default Controls
