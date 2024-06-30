import ProtectedRoute from "@common/components/ProtectedRoute";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Header from "@lib/dashboard/components/Header";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import MainSection from "@lib/dashboard/components/MainSection";
import Heading from "@lib/dashboard/components/Heading";
import useAuth from "@common/hooks/useAuth";
import { isIndividual } from "@common/utils/isIndividual";
import IndividualForm from "@lib/dashboard-edit-profile/components/IndividualForm";
import OrganizerForm from "@lib/dashboard-edit-profile/components/OrganizerForm";
import { Fragment } from "react";
import { isAdmin } from "@common/utils/isAdmin";
import useBankDetails from "@lib/dashboard-profile/hooks/useBankDetails";
import BankDetailsForm from "@lib/dashboard-edit-profile/components/BankDetailsForm";

export default function EditProfilePage() {
  const { user } = useAuth();
  const userData = JSON.stringify(user.data);
  const { data: bankDetails } = useBankDetails();

  return (
    <ProtectedRoute emailVerified>
      <DashboardHead title={"Edit Profile"} />
      <SidebarProvider>
        <Header />
        <MainSection>
          <Heading title={"Update profile"} />
          <Fragment key={userData}>
            {(user.data && isIndividual(user.data)) || isAdmin(user.data) ? (
              <IndividualForm key={user.data?.id} user={user.data} />
            ) : (
              user.data && (
                <>
                  <OrganizerForm key={user.data?.id} user={user.data} />
                  {typeof bankDetails !== "undefined" && (
                    <BankDetailsForm
                      key={JSON.stringify(bankDetails)}
                      bankDetails={bankDetails}
                    />
                  )}
                </>
              )
            )}
          </Fragment>
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
