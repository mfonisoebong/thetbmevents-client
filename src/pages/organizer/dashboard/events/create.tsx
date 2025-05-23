import ProtectedRoute from "@common/components/ProtectedRoute";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import MainSection from "@lib/dashboard/components/MainSection";
import SectionHeader from "@lib/create-event/components/SectionHeader";
import DashboardTabsProvider from "@lib/dashboard/contexts/DashboardTabs/Provider";
import { TABS } from "@lib/create-event/constants/tabs";
import EventForms from "@lib/create-event/components/EventForms";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import Header from "@lib/dashboard/components/Header";

export default function CreateEvent() {
  return (
    <ProtectedRoute emailVerified>
      <RedirectUser page={"organizer"} />
      <DashboardHead title="Create event" />
      <SidebarProvider>
        <Header />
        <MainSection>
          <SectionHeader
            heading="Create an event"
            closeLink="/organizer/dashboard/events"
          />
          <DashboardTabsProvider tabs={TABS}>
            <EventForms />
          </DashboardTabsProvider>
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
