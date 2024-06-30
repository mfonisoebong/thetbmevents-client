import DashboardHead from "@lib/dashboard/components/DashboardHead";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import Header from "@lib/dashboard/components/Header";
import RenderHydrated from "@common/components/RenderHydrated";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import MainSection from "@lib/dashboard/components/MainSection";
import SelectedUsersProvider from "@lib/admin-users/contexts/SelectedUsers/Provider";
import OrganizersHeader from "@lib/admin-organizers/components/OrganizersHeader";
import OrganizersTable from "@lib/admin-organizers/components/OrganizersTable";
import useOrganizers from "@lib/admin-organizers/hooks/useOrganizers";
import UsersPagination from "@lib/admin-users/components/UsersPagination";

export default function EventOrganizers() {
  const { data: organizers } = useOrganizers();

  return (
    <>
      <DashboardHead title={"Event organizers"} />
      <SidebarProvider>
        <Header />
        <RenderHydrated>
          <RedirectUser page={"admin"} admin={"support"} />
          <MainSection>
            <SelectedUsersProvider>
              <OrganizersHeader />
              <OrganizersTable />
            </SelectedUsersProvider>
            {organizers && <UsersPagination data={organizers} />}
          </MainSection>
        </RenderHydrated>
      </SidebarProvider>
    </>
  );
}
