import ProtectedRoute from "@common/components/ProtectedRoute";
import CategoriesHeader from "@lib/admin-categories/components/CategoriesHeader";
import CategoriesPagination from "@lib/admin-categories/components/CategoriesPagination";
import CategoriesTable from "@lib/admin-categories/components/CategoriesTable";
import CategoryModal from "@lib/admin-categories/components/CategoryModal";
import useCategories from "@lib/admin-categories/hooks/useCategories";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";

export default function EventCategories() {
  const { data: categories } = useCategories();

  return (
    <ProtectedRoute>
      <RedirectUser page="admin" admin={"manager"} />
      <DashboardHead title="Categories" />
      <SidebarProvider>
        <Header />
        <MainSection>
          <CategoriesHeader />
          <CategoriesTable />
          {categories && <CategoriesPagination data={categories} />}
          <CategoryModal />
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
