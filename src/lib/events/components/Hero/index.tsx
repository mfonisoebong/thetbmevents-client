import { FC } from "react"
import styles from "./styles.module.css"
import Heading from "./Heading"
import SearchFilter from "./SearchFilter"
import Container from "@common/components/Container"

const Hero: FC = () => {
  return (
    <section className={styles.hero}>
      <Container>
        <Heading />
        <SearchFilter />
      </Container>
    </section>
  )
}

export default Hero
