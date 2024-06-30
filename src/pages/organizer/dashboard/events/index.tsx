import ProtectedRoute from "@common/components/ProtectedRoute";
import Events from "@lib/dashboard-events/components/Events";
import EventsHeader from "@lib/dashboard-events/components/EventsHeader";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import RedirectUser from "@lib/dashboard/components/RedirectUser";

export default function OrganizerEvents() {
  return (
    <ProtectedRoute emailVerified>
      <RedirectUser page={"organizer"} />
      <DashboardHead title="Events" />
      <SidebarProvider>
        <Header />
        <MainSection>
          <EventsHeader />
          <Events />
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
