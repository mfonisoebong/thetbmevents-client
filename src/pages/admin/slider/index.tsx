import ProtectedRoute from "@common/components/ProtectedRoute";
import Actions from "@lib/admin-slider/components/Actions";
import SliderHeader from "@lib/admin-slider/components/SliderHeader";
import Slides from "@lib/admin-slider/components/Slides";
import SlidersProvider from "@lib/admin-slider/contexts/SlidersContext/Provider";
import useSlides from "@lib/admin-slider/hooks/useSlides";
import DashboardHead from "@lib/dashboard/components/DashboardHead";
import Header from "@lib/dashboard/components/Header";
import MainSection from "@lib/dashboard/components/MainSection";
import RedirectUser from "@lib/dashboard/components/RedirectUser";
import SidebarProvider from "@lib/dashboard/contexts/Sidebar/Provider";

export default function Slider() {
  const slides = useSlides();

  return (
    <ProtectedRoute>
      <DashboardHead title={"Events Slider"} />

      <RedirectUser page="admin" admin={"manager"} />
      <SidebarProvider>
        <Header />
        <MainSection>
          <SliderHeader />
          {slides.data && (
            <SlidersProvider fetchedSlides={slides.data}>
              <Slides />
              <Actions />
            </SlidersProvider>
          )}
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  );
}
