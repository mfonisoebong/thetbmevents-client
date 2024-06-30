export const options = {
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
      text: "Chart.js Bar Chart",
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      grid: {
        display: false,
      },
    },
  },
};

const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const data = {
  labels,
  datasets: [
    {
      label: "Earnings",
      data: [593, 265, 157, 489, 240, 457, 135, 234, 322, 108, 23, 332],
      backgroundColor: "#000000",
      borderRadius: 40,
      maxBarThickness: 6,
    },
    {
      label: "Commission",
      data: [150, 134, 44, 21, 105, 98, 66, 100, 102, 112, 100, 224],
      backgroundColor: "#518E99",
      borderRadius: 40,
      maxBarThickness: 6,
    },
  ],
};
