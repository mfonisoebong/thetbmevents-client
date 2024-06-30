import { FC } from "react";
import { PageHeroProps } from "@common/typings";
import Container from "@common/components/Container";
import Image from "next/image";
import styles from "./styles.module.css";
import Link from "next/link";
import CaretRight from "@common/components/Icons/CaretRight";
import AngleLeft from "@common/components/Icons/AngleLeft";
import AngleRight from "@common/components/Icons/AngleRight";
const PageHero: FC<PageHeroProps> = ({ title }) => {
  return (
    <section className={styles.pagehero}>
      <Image
        src={"/images/page_header_hero.webp"}
        alt={""}
        width={3775}
        height={2517}
      />
      <Container className={styles.container}>
        <div className={styles.textwrapper}>
          <h1>{title}</h1>
          <p>
            <Link href={"/"}>Home</Link> <AngleRight size={8} color={"white"} />{" "}
            <span>{title}</span>
          </p>
        </div>
      </Container>
    </section>
  );
};

export default PageHero;
