import ProtectedRoute from "@common/components/ProtectedRoute";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Header from "@lib/dashboard/components/Header";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import MainSection from "@lib/dashboard/components/MainSection";
import { CouponForm } from "@lib/coupons/components/CouponForm";
import useCoupon from "@lib/coupons/hooks/useCoupon";

export default function CouponsCreatePage() {
  const coupon = useCoupon();

  return (
    <ProtectedRoute emailVerified>
      <DashboardHead title="Create Coupon" />
      <SidebarProvider>
        <Header />
        <MainSection>
          <CouponForm coupon={coupon.data} key={JSON.stringify(coupon.data)} />
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
