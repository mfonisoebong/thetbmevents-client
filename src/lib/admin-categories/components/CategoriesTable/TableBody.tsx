import { FC } from "react"
import TableRow from "./TableRow"
import useFilterSort from "@lib/admin-categories/hooks/useFilterSort"

const TableBody: FC = () => {
  const { categories } = useFilterSort()

  return (
    <tbody>
      {categories?.map((u) => (
        <TableRow {...u} key={u.id} />
      ))}
    </tbody>
  )
}

export default TableBody
