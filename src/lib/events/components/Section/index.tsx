import Container from "@common/components/Container"
import { SectionProps } from "@lib/events/typings"
import { FC } from "react"

const Section: FC<SectionProps> = ({ title, children }) => {
  return (
    <section>
      <Container>
        <h1 className="text-slate-900 text-center font-bold text-xl md:text-3xl lg:text-5xl">
          {title}
        </h1>
        {children}
      </Container>
    </section>
  )
}

export default Section
