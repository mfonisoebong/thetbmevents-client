import { FC } from "react"
import Commissions from "./Commisions"
import Profit from "./Profit"

const CommisionsAndProfit: FC = () => {
  return (
    <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 space-x-0 md:space-x-4">
      <Commissions />
      <Profit />
    </div>
  )
}

export default CommisionsAndProfit
