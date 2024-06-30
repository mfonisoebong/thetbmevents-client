import { FC } from "react";
import Container from "../Container";
import AuthLinks from "./AuthLinks";
import NavLogo from "./NavLogo";
import NavLinks from "./NavLinks";

const Header: FC = () => {
  return (
    <header className="bg-main py-3 sticky top-0 z-40">
      <Container>
        <nav className="grid grid-cols-2 md:grid-cols-3">
          <AuthLinks />
          <NavLogo />
          <NavLinks />
        </nav>
      </Container>
    </header>
  );
};

export default Header;
