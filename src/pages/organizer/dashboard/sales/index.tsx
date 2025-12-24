import ProtectedRoute from "@common/components/ProtectedRoute";
import DashboardHead from "../../../../lib/dashboard/components/DashboardHead";
import Header from "../../../../lib/dashboard/components/Header";
import SidebarProvider from "../../../../lib/dashboard/contexts/Sidebar/Provider";
import MainSection from "../../../../lib/dashboard/components/MainSection";
import SalesHeader from "../../../../lib/dashboard-sales/components/SalesHeader";
import SearchSales from "../../../../lib/dashboard-sales/components/SearchSales";
import SalesTable from "../../../../lib/dashboard-sales/components/SalesTable";
import RedirectUser from "../../../../lib/dashboard/components/RedirectUser";
import SalesPagination from "../../../../lib/dashboard-sales/components/SalesPagination";
import useSales from "../../../../lib/dashboard-sales/hooks/useSales";

export default function Sales() {
  const { data: sales } = useSales();

  return (
    <ProtectedRoute emailVerified>
      <RedirectUser page={"organizer"} />
      <DashboardHead title={"Sales"} />
      <SidebarProvider>
        <Header>
        </Header>
          <MainSection>
              <SalesHeader />
              <SearchSales />
              <SalesTable />
          {sales && <SalesPagination data={sales} />}
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
