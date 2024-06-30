import { FC } from "react"
import Header from "./Header"
import Form from "./Form"

const PasswordForm: FC = () => {
  return (
    <section className="space-y-4 mt-12 w-full md:w-7/12 lg:w-6/12 mx-auto">
      <Header />
      <Form />
    </section>
  )
}
export default PasswordForm
