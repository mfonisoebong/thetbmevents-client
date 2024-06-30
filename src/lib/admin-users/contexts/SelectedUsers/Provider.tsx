import { FC, PropsWithChildren, useCallback, useState } from "react";
import { SelectedUsersContext } from "@lib/admin-users/contexts/SelectedUsers/Context";

const SelectedUsersProvider: FC<PropsWithChildren> = ({ children }) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const toggleSelected = (id: string) => {
    const hasUserId = selectedUserIds.includes(id);

    const newList = hasUserId
      ? selectedUserIds.filter((u) => u !== id)
      : [...selectedUserIds, id];

    setSelectedUserIds(() => newList);
  };

  const selectIds = useCallback((ids: string[]) => {
    setSelectedUserIds(() => ids);
  }, []);

  return (
    <SelectedUsersContext.Provider
      value={{
        toggleSelected,
        selectedUserIds,
        selectIds,
      }}
    >
      {children}
    </SelectedUsersContext.Provider>
  );
};

export default SelectedUsersProvider;
