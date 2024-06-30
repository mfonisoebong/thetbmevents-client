import { FC } from "react";
import styles from "./styles.module.css";
import useOrganizer from "@lib/admin-organizer/hooks/useOrganizer";
import DetailCard from "./DetailCard";
import Actions from "./Actions";
import useEditOrganizerContext from "@lib/admin-organizer/hooks/useEditOrganizerContext";
import useEditOrganizer from "@lib/admin-organizer/hooks/useEditOrganizer";
import ChangeUserStatus from "./ChangeUserStatus";

const UserDetails: FC = () => {
  const { data: organizer } = useOrganizer();
  const { organizerEdit } = useEditOrganizerContext();
  const { editSwiftCode, editCommision, editIban } = useEditOrganizer();
  if (!organizer) return null;

  const commisionRate =
    typeof organizerEdit.commision === "number" ||
    typeof organizerEdit.commision === "string"
      ? `${organizerEdit.commision}%`
      : "Not assigned";

  return (
    <section className="px-0 md:px-6 lg:px-12 py-10 space-y-4">
      <ChangeUserStatus />
      <div className={styles.userdetailsgrid}>
        <DetailCard title={"Organization name"} value={organizer.name} />
        <DetailCard title={"Email address"} value={organizer.email} />

        <DetailCard
          title={"Bank account number"}
          value={organizer.bank_details?.account_number ?? "Optional"}
        />
        <DetailCard
          title={"Bank account name"}
          value={organizer.bank_details?.account_name ?? "Optional"}
        />
        <DetailCard
          title={"Bank name"}
          value={organizer.bank_details?.bank_name ?? "Optional"}
        />
        <DetailCard
          title={"Commision"}
          inputType="number"
          editable
          onInputChange={editCommision}
          value={commisionRate}
          inputValue={organizerEdit.commision}
        />
        <DetailCard
          title={"Swift code"}
          editable
          onInputChange={editSwiftCode}
          value={organizerEdit.swiftCode ?? "Optional"}
          inputValue={organizerEdit.swiftCode}
        />
        <DetailCard
          onInputChange={editIban}
          editable
          inputValue={organizerEdit.iban}
          title={"IBAN"}
          value={organizerEdit.iban ?? "Optional"}
        />
      </div>
      <Actions />
    </section>
  );
};

export default UserDetails;
