import DashboardHead from "../../../../lib/dashboard/components/DashboardHead"
import ProtectedRoute from "@common/components/ProtectedRoute"
import SidebarProvider from "../../../../lib/dashboard/contexts/Sidebar/Provider"
import Header from "../../../../lib/dashboard/components/Header"
import MainSection from "../../../../lib/dashboard/components/MainSection"
import DatePicker from "../../../../lib/dashboard-finance/components/DatePicker"
import Overview from "../../../../lib/dashboard-finance/components/Overview"
import Revenue from "../../../../lib/dashboard-finance/components/Revenue"
import TopCustomers from "../../../../lib/dashboard-finance/components/TopCustomers"
import DatePickerProvider from "../../../../lib/dashboard-finance/contexts/DatePicker/Provider"
import AddDefaultQuery from "../../../../lib/dashboard-finance/components/AddDefaultQuery"
import useFinanceData from "../../../../lib/dashboard-finance/hooks/useFinanceData"
import Loader from "@common/components/RouteLoader/Loader"
import RedirectUser from "../../../../lib/dashboard/components/RedirectUser"

export default function FinancePage() {
  const { isLoading } = useFinanceData()

  return (
    <ProtectedRoute emailVerified>
      <RedirectUser page={"organizer"} />
      <DashboardHead title={"Finance"} />
      <AddDefaultQuery />
      <SidebarProvider>
        <Header />
        <MainSection>
          <DatePickerProvider>
            {isLoading ? (
              <Loader />
            ) : (
              <>
                <DatePicker />
                <Overview />
                <Revenue />
                <TopCustomers />
              </>
            )}
          </DatePickerProvider>
        </MainSection>
      </SidebarProvider>
    </ProtectedRoute>
  )
}
