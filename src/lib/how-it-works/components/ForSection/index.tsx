import { FC } from "react";
import { ForSectionProps } from "@lib/how-it-works/typings";
import PageSection from "@common/components/PageSection";
import { twMerge } from "tailwind-merge";
import WorkItem from "@lib/how-it-works/components/ForSection/WorkItem";

const ForSection: FC<ForSectionProps> = ({
  title,
  items,
  bgColor,
  spacingClass,
}) => {
  const c = twMerge("mt-6", bgColor ? "bg-gray-100" : null);

  return (
    <section className={c}>
      <PageSection title={title ?? ""}>
        <div className={"mx-auto lg:w-9/12 my-9"}>
          <div className={twMerge("space-y-4", spacingClass)}>
            {items.map((i) => (
              <WorkItem {...i} key={i.id} />
            ))}
          </div>
        </div>
      </PageSection>
    </section>
  );
};

export default ForSection;
