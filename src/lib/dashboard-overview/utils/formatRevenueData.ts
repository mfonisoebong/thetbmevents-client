const labels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export const formatRevenueData = (
  datasetLabels: string[],
  commisionData: number[],
  profitData: number[]
) => {
  return {
    labels,
    datasets: [
      {
        label: datasetLabels[0],
        data: commisionData,
        backgroundColor: "#000000",
        borderRadius: 40,
        maxBarThickness: 6,
      },
      {
        label: datasetLabels[1],
        data: profitData,
        backgroundColor: "#518E99",
        borderRadius: 40,
        maxBarThickness: 6,
      },
    ],
  }
}
