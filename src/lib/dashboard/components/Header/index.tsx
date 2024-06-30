import { FC, PropsWithChildren } from "react";
import styles from "./styles.module.css";
import NavControls from "./NavControls";
import Container from "@common/components/Container";
import MenuBar from "./MenuBar";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import NavLogo from "./NavLogo";

const Header: FC<PropsWithChildren> = ({ children }) => {
  const isLargeDevice = useMediaQuery(Device.large);

  return (
    <header className={styles.header}>
      <Container>
        <nav className={styles.navbar}>
          <NavLogo />

          {!isLargeDevice && <MenuBar />}
          {children}
          <NavControls />
        </nav>
      </Container>
    </header>
  );
};

export default Header;
