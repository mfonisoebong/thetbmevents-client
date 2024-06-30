import ProtectedRoute from "@common/components/ProtectedRoute";
import Heading from "@lib/admin-payment-method/components/Heading";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import PaymentMethod from "@lib/admin-payment-method/components/PaymentMethod";

export default function PaymentMethodPage() {
  return (
    <ProtectedRoute>
      <RedirectUser page="admin" admin={"manager"} />
      <DashboardHead title="Payment methods" />
      <SidebarProvider>
        <Header />
        <MainSection>
          <Heading />
          <PaymentMethod />
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
