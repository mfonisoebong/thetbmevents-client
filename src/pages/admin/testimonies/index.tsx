import DashboardHead from "@lib/dashboard/components/DashboardHead";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import Heading from "@lib/admin-dashboard/components/Heading";
import TestimoniesFormProvider from "@lib/admin-testimonies/components/TestimoniesFormProvider";
import useTestimonies from "@lib/admin-testimonies/hooks/useTestimonies";
import HeadingForm from "@lib/admin-testimonies/components/HeadingForm";
import Testimonies from "@lib/admin-testimonies/components/Testimonies";
import Actions from "@lib/admin-testimonies/components/Actions";
import ProtectedRoute from "@common/components/ProtectedRoute";

export default function TestimoniesPage() {
  const { data: testimoniesData } = useTestimonies();

  return (
    <ProtectedRoute>
      <DashboardHead title={"Testimonies"} />
      <RedirectUser page={"admin"} admin={"support"} />
      <SidebarProvider>
        <Header />
        <MainSection>
          <Heading title={"Testimonies"} />
          {testimoniesData && (
            <TestimoniesFormProvider
              key={JSON.stringify(testimoniesData)}
              testimoniesData={testimoniesData}
            >
              <HeadingForm />
              <Testimonies />
              <Actions />
            </TestimoniesFormProvider>
          )}
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
