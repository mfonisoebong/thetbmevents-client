import { FC, PropsWithChildren, useState } from "react";
import { EditOrganizerContext } from "./Context";
import { OrganizerEdit } from "@lib/admin-organizer/typings";
import { compareObjects } from "@common/utils/compareObjects";

const EditOrganizerProvider: FC<PropsWithChildren<OrganizerEdit>> = ({
  children,
  commision,
  iban,
  swiftCode,
}) => {
  const [organizerEdit, setOrganizerEdit] = useState<OrganizerEdit>({
    commision,
    iban,
    swiftCode,
  });
  const defaultProps = {
    commision,
    swiftCode,
    iban,
  };
  const notEdited =
    commision === organizerEdit.commision &&
    iban === organizerEdit.iban &&
    swiftCode === organizerEdit.swiftCode;

  const handleOrganizerEdit = <T extends keyof OrganizerEdit>(
    name: T,
    value: OrganizerEdit[T]
  ) => {
    setOrganizerEdit((state) => ({
      ...state,
      [name]: value,
    }));
  };

  return (
    <EditOrganizerContext.Provider
      value={{
        organizerEdit,
        handleOrganizerEdit,
        notEdited,
      }}
    >
      {children}
    </EditOrganizerContext.Provider>
  );
};

export default EditOrganizerProvider;
