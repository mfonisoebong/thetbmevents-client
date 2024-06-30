import { FC, PropsWithChildren } from "react";
import Container from "@common/components/Container";

const Wrapper: FC<PropsWithChildren> = ({ children }) => {
  return (
    <section className={"min-h-[110vh] bg-gray-100"}>
      <Container className={"h-full"}>
        <div
          className={
            "w-full min-h-[110vh] bg-white -translate-y-16 lg:-translate-y-28 px-4 lg:px-8 py-14"
          }
        >
          {children}
        </div>
      </Container>
    </section>
  );
};

export default Wrapper;
