import { FC } from "react";
import useFilterSort from "@lib/admin-users/hooks/useFilterSort";
import TableRow from "@lib/admin-users/components/UsersTable/TableRow";

const TableBody: FC = () => {
  const { users } = useFilterSort();

  return <tbody>{users?.map((u) => <TableRow {...u} key={u.id} />)}</tbody>;
};

export default TableBody;
