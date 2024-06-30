import Container from "@common/components/Container"
import FormHeader from "@lib/auth-pages/components/FormHeader"
import { FC } from "react"
import StaffForm from "../StaffForm"

const MainSection: FC = () => {
  return (
    <Container className="space-y-4 py-12 h-full">
      <FormHeader
        title="Hello admin!"
        subTitle={`Tell us more about the new staff`}
      />
      <StaffForm />
    </Container>
  )
}

export default MainSection
