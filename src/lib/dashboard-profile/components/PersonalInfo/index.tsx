import { FC } from "react"
import Information from "@lib/dashboard-profile/components/PersonalInfo/Information"
import InfoContainer from "../InfoContainer"
const PersonalInfo: FC = () => {
  return (
    <InfoContainer
      editLink="/dashboard/profile/edit"
      title="Personal information"
      withBorder
    >
      <Information />
    </InfoContainer>
  )
}

export default PersonalInfo
