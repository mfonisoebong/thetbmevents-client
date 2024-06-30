import { ChangeEvent, FC } from "react"
import styles from "./styles.module.css"
import { DetailCardProps } from "@lib/admin-organizer/typings"
import useToggle from "@common/hooks/useToggle"
import IconButton from "@common/components/IconButton"
import PencilOutline from "@common/components/Icons/PencilOutline"
import Close from "@common/components/Icons/Close"

const DetailCard: FC<DetailCardProps> = ({
  title,
  value,
  editable,
  onInputChange,
  inputType = "text",
  inputValue,
}) => {
  const { toggle: showInput, handleToggle } = useToggle()
  const icon = showInput ? (
    <Close color="black" size={18} />
  ) : (
    <PencilOutline color="black" size={18} />
  )

  return (
    <div className={styles.card}>
      {editable && (
        <IconButton
          onClick={handleToggle}
          className="absolute right-5"
          icon={icon}
        />
      )}
      <h4>{title}</h4>
      {showInput ? (
        <input
          type={inputType}
          min={0}
          step={0.1}
          max={100}
          value={inputValue}
          onChange={onInputChange}
        />
      ) : (
        <h6>{value}</h6>
      )}
    </div>
  )
}

export default DetailCard
