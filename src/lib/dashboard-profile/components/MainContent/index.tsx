import { FC } from "react"
import OverviewCard from "@lib/dashboard-overview/components/OverviewCard"
import UserInfo from "@lib/dashboard-profile/components/UserInfo"
import PersonalInfo from "@lib/dashboard-profile/components/PersonalInfo"

const MainContent: FC = () => {
  return (
    <OverviewCard theme={"light"}>
      <div className={"p-0 md:px-6 space-y-5"}>
        <UserInfo />
        <PersonalInfo />
      </div>
    </OverviewCard>
  )
}

export default MainContent
