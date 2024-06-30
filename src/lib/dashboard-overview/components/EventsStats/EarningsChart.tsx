import RenderHydrated from "@common/components/RenderHydrated";
import { FC } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import { Doughnut } from "react-chartjs-2";
import useOverview from "@lib/dashboard-overview/hooks/useOverview";

ChartJS.register(ArcElement, Tooltip, Legend);
const EarningsChart: FC = () => {
  const isLargeDevice = useMediaQuery(Device.large);
  const isMediumDevice = useMediaQuery(Device.medium);
  const { data: overview } = useOverview();
  const aspectRatio = isLargeDevice ? 1.1 : isMediumDevice ? 2 : 3.6;
  const cutout = isLargeDevice ? 35 : isMediumDevice ? 35 : 33;
  const key = aspectRatio + cutout;

  const data = {
    labels: ["Sold", "Not sold"],
    datasets: [
      {
        label: "Tickets",
        data: overview?.earnings
          ? [overview.earnings.sales, 100 - overview.earnings.sales]
          : [0, 0],
        backgroundColor: ["#518E99", "#FFFFFF"],

        borderWidth: 0,
      },
    ],
  };

  return (
    <RenderHydrated>
      <div className="relative h-auto max-w-full flex justify-center md:justify-start w-full lg:w-5/12">
        <div className="absolute right-[45%] md:right-1/2 top-[32%] md:top-[38%] text-white text-center">
          <p className="font-semibold text-xs leading-tight">
            {overview?.earnings.sales}%
          </p>
          <p className="font-semibold text-[0.8rem] leading-tight">sales</p>
        </div>
        <Doughnut
          key={key}
          className="md:mr-8"
          data={data}
          options={{
            responsive: true,
            aspectRatio,
            maintainAspectRatio: true,
            cutout,
            plugins: {
              legend: {
                display: false,
                labels: {
                  usePointStyle: true,
                },
              },
            },
          }}
        />
      </div>
    </RenderHydrated>
  );
};

export default EarningsChart;
