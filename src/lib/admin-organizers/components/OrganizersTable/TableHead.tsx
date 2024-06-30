import { ChangeEvent, FC } from "react"
import styles from "@lib/create-event/components/TicketForm/TicketsDisplay/styles.module.css"
import FormCheck from "@common/components/FormControls/FormCheck"
import useSelectedUsersContext from "@lib/admin-users/hooks/useSelectedUsersContext"
import useToggle from "@common/hooks/useToggle"
import useMediaQuery from "@common/hooks/useMediaQuery"
import { Device } from "@common/typings"
import useFilterSort from "@lib/admin-organizers/hooks/useFilterSort"

const TableHead: FC = () => {
  const { users } = useFilterSort()
  const { selectIds } = useSelectedUsersContext()
  const { toggle, handleToggle } = useToggle()
  const isLargeDevice = useMediaQuery(Device.large)

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const ids = users.map((u) => u.id)
      selectIds(ids)
    } else {
      selectIds([])
    }
    handleToggle()
  }

  if (!isLargeDevice) return null

  return (
    <thead className={styles.tablehead}>
      <tr>
        <th>
          <FormCheck checked={toggle} onChange={handleChange} />
        </th>
        <th>NAME</th>
        <th>EMAIL ADDRESS</th>
        <th>PHONE NUMBER</th>
        <th>DATE JOINED</th>
        <th></th>
      </tr>
    </thead>
  )
}

export default TableHead
