import ProtectedRoute from "@common/components/ProtectedRoute";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import MainSection from "@lib/dashboard/components/MainSection";
import Header from "@lib/dashboard/components/Header";
import Heading from "@lib/dashboard/components/Heading";
import MainContent from "@lib/dashboard-profile/components/MainContent";
import ChangePassword from "@lib/dashboard-profile/components/ChangePassword";
import useAuth from "@common/hooks/useAuth";
import BankDetails from "@lib/dashboard-profile/components/BankDetails";

export default function DasboardProfile() {
  const { user } = useAuth();
  const isLocalAuth = user.data?.auth_provider === "local";
  const isOrganizer = user.data?.role === "organizer";

  return (
    <ProtectedRoute emailVerified>
      <DashboardHead title={"Profile"} />
      <SidebarProvider>
        <Header />
        <MainSection>
          <Heading title={"My profile"} />
          <MainContent />
          {isOrganizer && <BankDetails />}
          {isLocalAuth && <ChangePassword />}
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
