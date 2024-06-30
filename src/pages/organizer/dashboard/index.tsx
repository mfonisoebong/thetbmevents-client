import ProtectedRoute from "@common/components/ProtectedRoute";
import CommisionsAndProfit from "../../../lib/dashboard-overview/components/CommisionsAndProfit";
import EventsStats from "../../../lib/dashboard-overview/components/EventsStats";
import Revenue from "../../../lib/dashboard-overview/components/Revenue";
import DashboardHead from "../../../lib/dashboard/components/DashboardHead";
import Header from "../../../lib/dashboard/components/Header";
import MainSection from "../../../lib/dashboard/components/MainSection";
import SidebarProvider from "../../../lib/dashboard/contexts/Sidebar/Provider";
import RedirectUser from "../../../lib/dashboard/components/RedirectUser";

export default function Dashboard() {
  return (
    <ProtectedRoute emailVerified>
      <RedirectUser page={"organizer"} />
      <DashboardHead />

      <SidebarProvider>
        <Header />
        <MainSection>
          <div className="pb-36 space-y-8">
            <EventsStats />
            <Revenue />
            <CommisionsAndProfit />
          </div>
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
