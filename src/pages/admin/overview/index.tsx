import DashboardHead from "@lib/dashboard/components/DashboardHead";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import RevenueEventOverview from "@lib/admin-overview/components/RevenueEventOverview";
import Revenue from "@lib/admin-overview/components/Revenue";
import LatestEvents from "@lib/admin-overview/components/LatestEvents";
import TopOrganizers from "@lib/admin-overview/components/TopOrganizers";
import TopCustomers from "@lib/admin-overview/components/TopCustomers";
import RenderHydrated from "@common/components/RenderHydrated";
import RedirectUser from "@lib/dashboard/components/RedirectUser";

export default function OverviewPage() {
  return (
    <>
      <DashboardHead title={"Admin Overview"} />
      <SidebarProvider>
        <Header />
        <MainSection>
          <RenderHydrated>
            <RedirectUser page={"admin"} admin={"manager"} />

            <div className="space-y-5">
              <RevenueEventOverview />
              <section
                className={
                  "grid grid-cols-1 lg:grid-cols-[70%,30%] gap-x-5 gap-y-3"
                }
              >
                <Revenue />
                <LatestEvents />
                <TopOrganizers />
                <TopCustomers />
              </section>
            </div>
          </RenderHydrated>
        </MainSection>
      </SidebarProvider>
    </>
  );
}
