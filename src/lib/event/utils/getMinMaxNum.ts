interface MinMax {
  min: number;
  max: number;
}

interface GetMinMaxNum {
  (nums: number[]): MinMax;
}
export const getMinMaxNum: GetMinMaxNum = (nums) => {
  let minNumber: number = typeof nums[0] === "number" ? nums[0] : 0;
  let maxNumber: number = typeof nums[0] === "number" ? nums[0] : 0;

  for (let i = 0; i < nums.length; i++) {
    if (nums[i] < minNumber) {
      minNumber = nums[i];
    }
    if (nums[i] > maxNumber) {
      maxNumber = nums[i];
    }
  }

  return {
    max: maxNumber,
    min: minNumber,
  };
};
