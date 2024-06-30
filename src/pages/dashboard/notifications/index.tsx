import ProtectedRoute from "@common/components/ProtectedRoute";
import Heading from "@lib/dashboard-notifications/components/Heading";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import Notifications from "@lib/dashboard-notifications/components/Notifications";

export default function NotificationsPage() {
  return (
    <ProtectedRoute emailVerified>
      <DashboardHead title={"Profile"} />
      <SidebarProvider>
        <Header />
        <MainSection>
          <Heading />
          <Notifications />
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
