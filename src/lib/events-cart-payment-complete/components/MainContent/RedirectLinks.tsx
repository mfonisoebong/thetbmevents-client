import { FC } from "react";
import styles from "./styles.module.css";
import ButtonLink from "@common/components/ButtonLink";
const RedirectLinks: FC = () => {
  return (
    <div className={styles.redirectlinks}>
      <ButtonLink href={"/"} size={"lg"} variant={"secondary"}>
        Back to homepage
      </ButtonLink>
      <ButtonLink href={"/events"} size={"lg"}>
        Continue shopping
      </ButtonLink>
    </div>
  );
};

export default RedirectLinks;
