import { FC } from "react";
import PageSection from "@common/components/PageSection";
import IconCard from "@common/components/IconCard/IconCard";
import styles from "./styles.module.css";

const SERVICES = [
  {
    id: "1",
    icon: "/images/groups.svg",
    title: "member",
    text: "267",
  },
  {
    id: "2",
    icon: "/images/universal.svg",
    title: "venues",
    text: "333",
  },
  {
    id: "3",
    icon: "/images/monetization.svg",
    title: "sponsors",
    text: "120",
  },
  {
    id: "4",
    icon: "/images/ticket.svg",
    title: "tickets",
    text: "11000+",
  },
];

const OurSevices: FC = () => {
  return (
    <PageSection
      title="Our Services"
      description="What you will learn and the benefits ?"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 my-4 md:my-14 lg:my-20">
        {SERVICES.map((s) => (
          <IconCard
            key={s.id}
            className={styles.card}
            icon={s.icon}
            text={s.text}
            title={s.title}
          />
        ))}
      </div>
    </PageSection>
  );
};

export default OurSevices;
