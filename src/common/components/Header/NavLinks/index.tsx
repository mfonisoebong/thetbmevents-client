import { FC, useState } from "react";
import NavLink from "./NavLink";
import Menu from "@common/components/Icons/Menu";
import Link from "next/link";
import ButtonLink from "@common/components/ButtonLink";
import styles from "../styles.module.css";
import useMediaQuery from "@common/hooks/useMediaQuery";
import { Device } from "@common/typings";
import Close from "@common/components/Icons/Close";
import useAuth from "@common/hooks/useAuth";
import UserActions from "@common/components/Header/AuthLinks/UserActions";

const NavLinks: FC = () => {
  const [smShow, setSmShow] = useState(false);
  const smClass = smShow ? styles.navlinklistsm : "hidden";
  const isMediumDevice = useMediaQuery(Device.medium);
  const navLinkListClassName = isMediumDevice ? styles.navlinklist : smClass;
  const toggleSmShow = () => {
    if (isMediumDevice) return;
    setSmShow((state) => !state);
  };

  return (
    <div className={styles.navlinks}>
      <div className="flex space-x-5 items-center">
        <div className={"block md:hidden"}>
          <UserActions />
        </div>
        {smShow ? (
          <Close
            onClick={toggleSmShow}
            className="block md:hidden fill-white hover:fill-gold"
          />
        ) : (
          <Menu
            onClick={toggleSmShow}
            className="block md:hidden fill-white hover:fill-gold"
          />
        )}
      </div>
      <ul className={navLinkListClassName}>
        <NavLink onClick={toggleSmShow} href="/events">
          Events
        </NavLink>
        <NavLink onClick={toggleSmShow} href="/about">
          About Us
        </NavLink>
        <NavLink onClick={toggleSmShow} href="/contact">
          Contact Us
        </NavLink>
        <NavLink onClick={toggleSmShow} href="/how-it-works">
          How it works?
        </NavLink>

        {!isMediumDevice && (
          <>
            <Link
              onClick={toggleSmShow}
              href="/login"
              className="px-6 text-white font-semibold text-sm md:text-base"
            >
              Login
            </Link>
            <ButtonLink
              onClick={toggleSmShow}
              variant="altPrimary"
              href="/signup/organizer"
              className="text-sm md:text-base"
            >
              Sign Up
            </ButtonLink>
          </>
        )}
      </ul>
    </div>
  );
};

export default NavLinks;
