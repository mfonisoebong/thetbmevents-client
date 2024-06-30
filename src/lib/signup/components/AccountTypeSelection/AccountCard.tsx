import { capitalizeFirstLetter } from "@common/utils/capitalizeFirstLetter"
import { AccountCardProps } from "@lib/signup/typings"
import Image from "next/image"
import { FC } from "react"
import styles from "./styles.module.css"
import useAccountSelectionContext from "@lib/signup/hooks/useAccountSelectionContext"

const AccountCard: FC<AccountCardProps> = ({ account }) => {
  const { account: selectedAccount, changeAccount } =
    useAccountSelectionContext()
  const isSelected = selectedAccount === account
  const imageUrl =
    account === "individual"
      ? "/images/account_type_user.png"
      : "/images/account_type_org.png"

  const onCardClick = () => {
    changeAccount(account)
  }

  return (
    <div
      onClick={onCardClick}
      className={isSelected ? styles.selectedcard : styles.card}
    >
      <div className={styles.cardimg}>
        <Image priority src={imageUrl} width={300} height={300} alt={account} />
      </div>
      <div>
        <h3>{capitalizeFirstLetter(account)}</h3>
      </div>
    </div>
  )
}

export default AccountCard
