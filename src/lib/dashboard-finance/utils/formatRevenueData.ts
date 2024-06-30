const labels = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export const formatRevenueData = (
  datasetLabels: string[],
  revenueData: number[],
  commisionData: number[],
  profitData: number[]
) => {
  return {
    labels,
    datasets: [
      {
        label: datasetLabels[0],
        data: revenueData,
        backgroundColor: "#000000",
        borderRadius: 40,
        maxBarThickness: 6,
      },
      {
        label: datasetLabels[1],
        data: commisionData,
        backgroundColor: "#518E99",
        borderRadius: 40,
        maxBarThickness: 6,
      },
      {
        label: datasetLabels[2],
        data: profitData,
        backgroundColor: "#EDB511",
        borderRadius: 40,
        maxBarThickness: 6,
      },
    ],
  }
}
