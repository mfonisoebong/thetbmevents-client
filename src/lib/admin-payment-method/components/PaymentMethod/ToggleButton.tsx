import { FC } from "react"
import styles from "./styles.module.css"
import { ToggleButtonProps } from "@lib/admin-payment-method/typings"
const ToggleButton: FC<ToggleButtonProps> = ({ gateway, onToggle }) => {
  return (
    <div className="flex items-center space-x-2">
      <p className="text-xs md:text-sm">Flutterwave</p>
      <button
        onClick={onToggle}
        className={styles.toggle}
        data-select={gateway}
      ></button>
      <p className="text-xs md:text-sm">Paystack</p>
    </div>
  )
}

export default ToggleButton
