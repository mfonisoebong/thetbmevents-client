import DashboardHead from "@lib/dashboard/components/DashboardHead";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import Header from "@lib/dashboard/components/Header";
import RenderHydrated from "@common/components/RenderHydrated";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import MainSection from "@lib/dashboard/components/MainSection";
import SelectedUsersProvider from "@lib/admin-users/contexts/SelectedUsers/Provider";
import AdminsHeader from "@lib/admin-admins/components/AdminsHeader";
import AdminsTable from "@lib/admin-admins/components/AdminsTable";
import useAdmins from "@lib/admin-admins/hooks/useAdmins";
import UsersPagination from "@lib/admin-users/components/UsersPagination";

export default function EventOrganizers() {
  const { data: admins } = useAdmins();

  return (
    <>
      <DashboardHead title={"Event organizers"} />
      <SidebarProvider>
        <Header />
        <RenderHydrated>
          <RedirectUser page={"admin"} admin={"super_admin"} />
          <MainSection>
            <SelectedUsersProvider>
              <AdminsHeader />
              <AdminsTable />
            </SelectedUsersProvider>
            {admins && <UsersPagination data={admins} />}
          </MainSection>
        </RenderHydrated>
      </SidebarProvider>
    </>
  );
}
