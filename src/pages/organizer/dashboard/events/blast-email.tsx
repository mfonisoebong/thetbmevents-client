import ProtectedRoute from "@common/components/ProtectedRoute";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import SectionHeader from "@lib/create-event/components/SectionHeader";
import { EmailForm } from "@lib/blast-email/components/EmailForm";

export default function OrganizerEvents() {
  return (
    <ProtectedRoute emailVerified>
      <RedirectUser page={"organizer"} />
      <DashboardHead title="Blast email" />
      <SidebarProvider>
        <Header />
        <MainSection>
          <SectionHeader
            heading="Blast email"
            closeLink="/organizer/dashboard/events"
          />
          <EmailForm />
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
