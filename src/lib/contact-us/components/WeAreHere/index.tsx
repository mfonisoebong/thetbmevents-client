import { FC } from "react";
import PageSection from "@common/components/PageSection";

const WeAreHere: FC = () => {
  return (
    <PageSection title={"We are here"}>
      <div className="py-8 lg:py-14 text-sm w-full lg:w-8/12 mx-auto space-y-3">
        <p>
          You can simply reach us via contact address and the contact form
          below, report a complain, or speak to our admin regarding your forth
          coming event you will like TBM to power.
        </p>
        <p>Thank for always choosing TBM!</p>
      </div>
    </PageSection>
  );
};

export default WeAreHere;
