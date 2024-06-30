import { FC } from "react";
import styles from "@lib/dashboard-overview/components/Revenue/styles.module.css";
import { Bar } from "react-chartjs-2";
import { data, options } from "@lib/dashboard-overview/constants/mockRevenue";
import Oval from "@common/components/Icons/Oval";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { formatRevenueData } from "@lib/dashboard-overview/utils/formatRevenueData";
import useOverview from "@lib/admin-overview/hooks/useOverview";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);
const RevenueChart: FC = () => {
  const { data: overview } = useOverview();

  if (!overview) return null;

  const commisionData = overview.revenue.map((r) => r.net_commision);

  const earningData = overview.revenue.map((r) => r.net_revenue);

  const formattedData = formatRevenueData(
    ["Commision", "Earnings"],
    commisionData,
    earningData,
  );

  return (
    <div className={styles.chart}>
      <Bar
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
  );
};

export default RevenueChart;
