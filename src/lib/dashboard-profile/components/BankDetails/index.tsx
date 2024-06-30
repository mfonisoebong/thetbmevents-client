import { FC } from "react";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import InfoContainer from "../InfoContainer";
import useBankDetails from "@lib/dashboard-profile/hooks/useBankDetails";
import Info from "../Info";
import AlertBox from "@common/components/Alert/AlertBox";
import useToggle from "@common/hooks/useToggle";

const BankDetails: FC = () => {
  const { data: bankDetails } = useBankDetails();
  const { toggle: showAlert, handleToggle } = useToggle(true);

  const showInfoAlert =
    showAlert &&
    (!bankDetails?.bank_name ||
      !bankDetails.account_name ||
      !bankDetails.account_number);
  return (
    <OverviewCard theme="light">
      {showInfoAlert && (
        <AlertBox
          className="w-full"
          body="You are required to fill in all necessary details in order to recieve payment"
          index={0}
          title="Info"
          type="info"
          close={handleToggle}
        />
      )}
      <InfoContainer editLink="/dashboard/profile/edit" title="Bank details">
        <Info title="Bank name" value={bankDetails?.bank_name} />
        <Info title="Account name" value={bankDetails?.account_name} />
        <Info title="Account number" value={bankDetails?.account_number} />
        <Info title="Swift code" value={bankDetails?.swift_code} />
        <Info title="IBAN" value={bankDetails?.iban} />
      </InfoContainer>
    </OverviewCard>
  );
};

export default BankDetails;
