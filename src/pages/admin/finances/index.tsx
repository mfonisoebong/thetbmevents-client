import ProtectedRoute from "@common/components/ProtectedRoute";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import RevenueOverview from "@lib/admin-finances/components/RevenueOverview";
import Revenue from "@lib/admin-finances/components/Revenue";
import TopCustomers from "@lib/admin-finances/components/TopCustomers";
import TopOrganizers from "@lib/admin-finances/components/TopOrganizers";

export default function Finances() {
  return (
    <ProtectedRoute>
      <RedirectUser page="admin" admin={"manager"} />
      <DashboardHead title="Admin finances" />
      <SidebarProvider>
        <Header />
        <MainSection>
          <RevenueOverview />
          <Revenue />
          <div className="flex flex-col lg:flex-row gap-6">
            <TopOrganizers />
            <TopCustomers />
          </div>
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
