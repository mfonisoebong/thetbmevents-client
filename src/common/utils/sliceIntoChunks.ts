export const sliceIntoChunks = <T>(arr: T[], chunkSize: number): T[][] => {
  const res: T[][] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk: T[] = arr.slice(i, i + chunkSize)
    res.push(chunk)
  }
  return res
}
