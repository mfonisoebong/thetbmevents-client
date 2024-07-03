import ProtectedRoute from "@common/components/ProtectedRoute";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Header from "@lib/dashboard/components/Header";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import MainSection from "@lib/dashboard/components/MainSection";
import { CouponForm } from "@lib/coupons/components/CouponForm";

export default function CouponsCreatePage() {
  return (
    <ProtectedRoute emailVerified>
      <DashboardHead title="Create Coupon" />
      <SidebarProvider>
        <Header />
        <MainSection>
          <CouponForm />
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
