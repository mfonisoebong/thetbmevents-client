import { FC } from "react";
import InfoCard from "./InfoCard";
import FooterLinks from "./FooterLinks";
import Copyright from "./Copyright";

const Footer: FC = () => {
  return (
    <footer className="py-5 bg-main md:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-8">
        <InfoCard />
        <FooterLinks />
      </div>
      <Copyright />
    </footer>
  );
};

export default Footer;
