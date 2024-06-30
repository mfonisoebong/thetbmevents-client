import { FC } from "react"
import useAuth from "@common/hooks/useAuth"
import { isIndividual } from "@common/utils/isIndividual"
import { phoneNumberFormatter } from "@common/utils/phoneNumberFormatter"
import { isAdmin } from "@common/utils/isAdmin"
import Info from "../Info"

const Information: FC = () => {
  const { user } = useAuth()

  return (
    <>
      {isIndividual(user.data) || isAdmin(user.data) ? (
        <>
          <Info title="First name" value={user.data.first_name} />
          <Info title="Last name" value={user.data.last_name} />
        </>
      ) : (
        <Info title="Buisness name" value={user.data?.buisness_name} />
      )}
      <Info title="Email address" value={user.data?.email} />

      <Info
        title="Phone number"
        value={phoneNumberFormatter(
          user.data?.phone_dial_code,
          user.data?.phone_number
        )}
      />
      <Info title="Country" value={user.data?.country} />
    </>
  )
}

export default Information
