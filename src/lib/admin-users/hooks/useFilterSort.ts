import { useEffect, useState } from "react";
import { SortFilter, User } from "@lib/admin-users/typings";
import useUsers from "@lib/admin-users/hooks/useUsers";
import { useSearchParams } from "next/navigation";

export default function useFilterSort() {
  const { data: usersData } = useUsers();
  const searchParams = useSearchParams();
  const sort = searchParams.get("sort") as SortFilter;
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!usersData?.data) return;
    if (sort === "Name") {
      const sorted = usersData.data;
      sorted.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName < bName) return -1;
        if (aName > bName) return 1;

        return 0;
      });

      setUsers(() => sorted);
    }

    if (sort === "Email address") {
      const sorted = usersData.data;
      sorted.sort((a, b) => {
        const aEmail = a.email.toLowerCase();
        const bEmail = b.email.toLowerCase();
        if (aEmail < bEmail) return -1;
        if (aEmail > bEmail) return 1;

        return 0;
      });

      setUsers(() => sorted);
    }
  }, [sort, usersData?.data]);

  useEffect(() => {
    if (!usersData?.data) return;

    setUsers(() => usersData.data);
  }, [usersData?.data]);

  return { users };
}
