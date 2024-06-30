import ProtectedRoute from "@common/components/ProtectedRoute";
import RenderHydrated from "@common/components/RenderHydrated";
import PageHeader from "@lib/admin-organizer/components/PageHeader";
import RedirectWrapper from "@lib/admin-organizer/components/RedirectWrapper";
import UserDetails from "@lib/admin-organizer/components/UserDetails";
import EditOrganizerProvider from "@lib/admin-organizer/contexts/EditOrganizer/Provider";
import useOrganizer from "@lib/admin-organizer/hooks/useOrganizer";
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import { GetStaticPaths, GetStaticProps } from "next";

export default function EventOrganizer() {
  const { data: organizer } = useOrganizer();

  return (
    <ProtectedRoute>
      <RedirectWrapper>
        <DashboardHead title={"Event organizers"} />

        <SidebarProvider>
          <Header />
          <RenderHydrated>
            <RedirectUser page="admin" admin={"support"} />
            <MainSection>
              <PageHeader />
              <OverviewCard theme="light">
                {organizer && (
                  <EditOrganizerProvider
                    commision={organizer.commision?.rate}
                    swiftCode={organizer.bank_details?.swift_code}
                    iban={organizer.bank_details?.iban}
                  >
                    <UserDetails />
                  </EditOrganizerProvider>
                )}
              </OverviewCard>
            </MainSection>
          </RenderHydrated>
        </SidebarProvider>
      </RedirectWrapper>
    </ProtectedRoute>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = () => {
  return {
    props: {},
  };
};
