import { FC } from "react"
import FormHeader from "@lib/auth-pages/components/FormHeader"
import Container from "@common/components/Container"
import LoginForm from "./LoginForm"

const MainSection: FC = () => {
  return (
    <Container className="space-y-4 py-12 h-full">
      <FormHeader title="Hello friend!" subTitle="Welcome back" />
      <LoginForm />
    </Container>
  )
}

export default MainSection
