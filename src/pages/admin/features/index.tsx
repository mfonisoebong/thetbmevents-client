import ProtectedRoute from "@common/components/ProtectedRoute";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Heading from "@lib/admin-dashboard/components/Heading";
import FeaturesFormProvider from "@lib/admin-features/components/FeaturesFormProvider";
import useFeatures from "@lib/admin-features/hooks/useFeatures";
import HeadingForm from "@lib/admin-features/components/HeadingForm";
import Features from "@lib/admin-features/components/Features";
import Actions from "@lib/admin-features/components/Actions";
export default function FeaturesPge() {
  const { data: featues } = useFeatures();

  return (
    <ProtectedRoute>
      <RedirectUser page={"admin"} admin={"manager"} />
      <DashboardHead title={"Features"} />
      <SidebarProvider>
        <Header />
        <MainSection>
          <Heading title={"Features"} />
          {featues && (
            <FeaturesFormProvider
              featuresData={featues}
              key={JSON.stringify(featues)}
            >
              <HeadingForm />
              <Features />
              <Actions />
            </FeaturesFormProvider>
          )}
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
