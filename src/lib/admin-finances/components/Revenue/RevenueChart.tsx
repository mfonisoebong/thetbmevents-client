import { FC } from "react"
import styles from "@lib/dashboard-overview/components/Revenue/styles.module.css"
import { Line } from "react-chartjs-2"
import { data, options } from "@lib/dashboard-overview/constants/mockRevenue"
import Oval from "@common/components/Icons/Oval"
import {
  LineElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  PointElement,
  Tooltip,
} from "chart.js"
import { formatRevenueData } from "@lib/dashboard-overview/utils/formatRevenueData"
import useRevenue from "@lib/admin-overview/hooks/useRevenue"

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
)
const RevenueChart: FC = () => {
  const { data: revenue } = useRevenue()

  if (!revenue) return null

  const commisionData = revenue.map((r) => r.net_commision)

  const earningData = revenue.map((r) => r.net_revenue)

  const formattedData = formatRevenueData(
    ["Commision", "Earnings"],
    commisionData,
    earningData
  )

  return (
    <div className={styles.chart}>
      <Line
        options={options}
        style={{
          top: 50,
        }}
        data={formattedData}
      />
      <div className={styles.chartlabel}>
        <p>
          <Oval size={22} color="#518E99" />
          <span>Earning</span>
        </p>
        <p>
          <Oval size={22} color="black" />

          <span>Commission</span>
        </p>
      </div>
    </div>
  )
}

export default RevenueChart
