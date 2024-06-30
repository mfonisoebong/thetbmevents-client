import { FC } from "react"
import TableRow from "./TableRow"
import useFilterSort from "@lib/admin-admins/hooks/useFilterSort"

const TableBody: FC = () => {
  const { users } = useFilterSort()

  return (
    <tbody>
      {users?.map((u) => (
        <TableRow {...u} key={u.id} />
      ))}
    </tbody>
  )
}

export default TableBody
