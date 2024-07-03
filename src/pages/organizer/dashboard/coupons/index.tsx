import ProtectedRoute from "@common/components/ProtectedRoute";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import { CouponsHeader } from "@lib/coupons/components/CouponsHeader";
import CouponsTable from "@lib/coupons/components/CouponsTable";
import CouponsPagination from "@lib/coupons/components/CouponsPagination";

export default function CouponsPage() {
  return (
    <ProtectedRoute emailVerified>
      <DashboardHead title="Coupons" />
      <SidebarProvider>
        <Header />
        <MainSection>
          <CouponsHeader />
          <CouponsTable />
          <CouponsPagination />
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
