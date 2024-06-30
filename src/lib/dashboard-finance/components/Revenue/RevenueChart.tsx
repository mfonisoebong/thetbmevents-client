import { FC } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import Oval from "@common/components/Icons/Oval"
import { options, data } from "@lib/dashboard-finance/constants/mockRevenue"
import useFinanceData from "@lib/dashboard-finance/hooks/useFinanceData"
import { formatRevenueData } from "@lib/dashboard-finance/utils/formatRevenueData"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const RevenueChart: FC = () => {
  const { data: finance } = useFinanceData()

  if (!finance) return null

  const commisionData = finance?.overview.map((f) => f.commision)
  const profitData = finance?.overview.map((f) => f.profit)
  const revenueData = finance?.overview.map((f) => f.revenue)

  const formattedData = formatRevenueData(
    ["Revenue", "Commision", "Earnings"],
    revenueData,
    commisionData,
    profitData
  )

  return (
    <div className="pt-16 md:pl-12 relative h-[20rem] md:h-[24rem]">
      <Bar
        options={options}
        style={{
          top: 50,
        }}
        data={formattedData}
      />
      <div className="absolute right-4 top-2 space-y-0 md:space-y-2">
        <p className="text-xs md:text-sm flex items-center space-x-3 font-medium">
          <Oval size={22} color="#518E99" />
          <span>Revenue</span>
        </p>
        <p className="text-xs md:text-sm flex items-center space-x-3 font-medium">
          <Oval size={22} color="black" />

          <span>Commission</span>
        </p>
        <p className="text-xs md:text-sm flex items-center space-x-3 font-medium">
          <Oval size={22} color="#EDB511" />

          <span>Profit</span>
        </p>
      </div>
    </div>
  )
}

export default RevenueChart
