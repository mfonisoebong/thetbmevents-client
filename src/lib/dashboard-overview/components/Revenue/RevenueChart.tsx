import { FC } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Oval from "@common/components/Icons/Oval";
import { options, data } from "@lib/dashboard-overview/constants/mockRevenue";
import useOverview from "@lib/dashboard-overview/hooks/useOverview";
import { formatRevenueData } from "@lib/dashboard-overview/utils/formatRevenueData";
import styles from "./styles.module.css";
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

  const commisionData = overview.revenue.map((r) => r.commision);
  const profitData = overview.revenue.map((r) => r.profit);

  const formattedData = formatRevenueData(
    ["Commision", "Earnings"],
    commisionData,
    profitData,
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
