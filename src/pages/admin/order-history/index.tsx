import ProtectedRoute from "@common/components/ProtectedRoute";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import Heading from "@lib/admin-dashboard/components/Heading";
import OrderHistoryHeader from "@lib/admin-order-history/components/OrderHistoryHeader";
import useOrderHistory from "@lib/admin-order-history/hooks/useOrderHistory";
import OrganizersPagination from "@lib/admin-order-history/components/OrderHistoryPagination";
import OrderHistoryTable from "@lib/admin-order-history/components/OrderHistoryTable";

export default function OrderHistoryPage() {
  const { data: orderHistory } = useOrderHistory();

  return (
    <ProtectedRoute>
      <RedirectUser page={"admin"} admin={"support"} />
      <DashboardHead title={"Order history"} />
      <SidebarProvider>
        <Header />
        <MainSection>
          <Heading title={"Order history"} />
          <OrderHistoryHeader />
          <OrderHistoryTable />
          {orderHistory && <OrganizersPagination data={orderHistory} />}
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
