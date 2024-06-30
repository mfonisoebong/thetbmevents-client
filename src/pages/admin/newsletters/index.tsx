import ProtectedRoute from "@common/components/ProtectedRoute";
import RouteLoader from "@common/components/RouteLoader";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import NewsletterPagination from "@lib/admin-newsletter/components/NewsletterPagination";
import useNewsletterSignups from "@lib/admin-newsletter/hooks/useNewsletterSignups";
import NewsletterHeader from "@lib/admin-newsletter/components/NewslettersHeader";
import NewslettersTable from "@lib/admin-newsletter/components/NewslettersTable";

export default function Newsletter() {
  const { data: newsletters } = useNewsletterSignups();

  return (
    <RouteLoader>
      <ProtectedRoute>
        <DashboardHead title={"Newsletter signups"} />
        <RedirectUser page="admin" admin={"manager"} />
        <SidebarProvider>
          <Header />
          <MainSection>
            <NewsletterHeader />
            <NewslettersTable />
            {newsletters && <NewsletterPagination data={newsletters} />}
          </MainSection>
        </SidebarProvider>
      </ProtectedRoute>
    </RouteLoader>
  );
}
