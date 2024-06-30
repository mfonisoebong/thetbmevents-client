import { PageSectionProps } from "@common/typings"
import { FC } from "react"
import Container from "../Container"
import styles from "./styles.module.css"

const PageSection: FC<PageSectionProps> = ({
  title,
  children,
  description,
}) => {
  return (
    <section>
      <Container>
        <div className={styles.header}>
          <h2>{title}</h2>
          {description && (
            <>
              <p>{description}</p>
              <hr />
            </>
          )}
        </div>
        {children}
      </Container>
    </section>
  )
}

export default PageSection
