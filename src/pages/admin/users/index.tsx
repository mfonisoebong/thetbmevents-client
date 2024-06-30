import DashboardHead from "@lib/dashboard/components/DashboardHead";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import RenderHydrated from "@common/components/RenderHydrated";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import useUsers from "@lib/admin-users/hooks/useUsers";
import UsersPagination from "@lib/admin-users/components/UsersPagination";
import UsersHeader from "@lib/admin-users/components/UsersHeader";
import UsersTable from "@lib/admin-users/components/UsersTable";
import SelectedUsersProvider from "@lib/admin-users/contexts/SelectedUsers/Provider";

export default function UsersPage() {
  const { data: users } = useUsers();

  return (
    <>
      <DashboardHead title={"Users"} />
      <SidebarProvider>
        <Header />
        <RenderHydrated>
          <RedirectUser page={"admin"} admin={"support"} />
          <MainSection>
            <SelectedUsersProvider>
              <UsersHeader />
              <UsersTable />
            </SelectedUsersProvider>
            {users && <UsersPagination data={users} />}
          </MainSection>
        </RenderHydrated>
      </SidebarProvider>
    </>
  );
}
