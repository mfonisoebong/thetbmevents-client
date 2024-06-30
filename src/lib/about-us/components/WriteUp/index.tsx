import Container from "@common/components/Container"
import { FC } from "react"

const WriteUp: FC = () => {
  return (
    <section className="mb-16">
      <Container className="space-y-7 text-sm text-gray-800 font-normal">
        <div>
          <p>
            TBM Events is a subsidiary of TheBigMarket product, The new product
            will power event ticketing management for cooperate events, online
            webinars and parties and also with intention to grow the adoption of
            virtual conferences.
          </p>
        </div>
        <div className="space-y-3">
          <p>
            In addition, this digital platform assists event lovers in finding
            upcoming events near them such as musical festivals, concerts,
            conferences, shows, and seminars. We also use our social media
            network to market your event to the appropriate audience at no
            additional cost.
          </p>
          <p>
            TBM EVENTS handles event ticketing (free and paid), attendee
            registration, and event check-in, making your event ticketing
            process simple and freeing up your time to attend to other aspects
            of the event.
          </p>
        </div>
      </Container>
    </section>
  )
}

export default WriteUp
