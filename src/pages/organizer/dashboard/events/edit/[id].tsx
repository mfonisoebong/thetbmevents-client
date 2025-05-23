import { GetStaticPaths, GetStaticProps } from "next";

import useUserEvent from "@lib/edit-event/hooks/useUserEvent";
import ProtectedRoute from "@common/components/ProtectedRoute";
import RedirectWrapper from "@lib/edit-event/components/RedirectWrapper";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import { TABS } from "@lib/create-event/constants/tabs";
import DashboardTabsProvider from "@lib/dashboard/contexts/DashboardTabs/Provider";
import EventForms from "@lib/create-event/components/EventForms";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import SectionHeader from "@lib/create-event/components/SectionHeader";
import Loader from "@common/components/RouteLoader/Loader";
import RedirectUser from "@lib/dashboard/components/RedirectUser";

export default function EditEvent() {
  const event = useUserEvent();
  const title = event.data?.event.title
    ? `Edit ${event.data?.event.title}`
    : "Loading...";

  return (
    <ProtectedRoute emailVerified>
      <RedirectUser page={"organizer"} />
      <RedirectWrapper>
        <DashboardHead title={title} />
        <SidebarProvider>
          <Header />
          <MainSection>
            <SectionHeader
              heading={`Edit ${event.data?.event.title}`}
              closeLink="/organizer/dashboard/events"
            />
            <DashboardTabsProvider tabs={TABS}>
              {event.data && (
                <EventForms
                  event={event.data.event}
                  tickets={event.data.tickets}
                />
              )}
              {event.isLoading && <Loader />}
            </DashboardTabsProvider>
          </MainSection>
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

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {},
  };
};
