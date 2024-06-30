import Container from "@common/components/Container"
import { FC } from "react"
import Heading from "./Heading"
import Main from "./Main"

const NewsLetter: FC = () => {
  return (
    <section className="bg-main/20">
      <Container>
        <Heading />
        <Main />
      </Container>
    </section>
  )
}

export default NewsLetter
