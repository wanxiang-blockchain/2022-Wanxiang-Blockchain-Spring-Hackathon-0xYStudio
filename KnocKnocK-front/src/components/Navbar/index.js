import React, { useState, useEffect } from "react";
import { FaBars } from "react-icons/fa";
import { IconContext } from "react-icons/lib";
import { animateScroll as scroll } from "react-scroll";
import { ChakraProvider, useDisclosure } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import theme from "../../theme";
import Layout from "../PublicCom/Layout";
import AccountModal from "../PublicCom/AccountModal";
import logo from "assets/images/logo.png";
import Sidebar from "components/Sidebar";
import {
  MobileIcon,
  Nav,
  NavbarContainer,
  NavItem,
  NavLinks,
  NavLogo,
  NavMenu,
  NavBtn,
  NavLinkRoute,
} from "./NavbarElements";
import ConnectButton from "../PublicCom/ConnectButton";

const Navbar = ({ showWalletBtn }) => {
  const [clientWidth, setClientWidth] = useState(
    window.document.body.clientWidth
  );
  const [showNavbar, setShowNavbar] = useState(true);
  let location = useLocation();
  let navdata = [];
  if (location.pathname === "/") {
    navdata = [
      {
        to: "turtleCase",
        text: "Turtlecase",
        duration: 500,
        spy: true,
        offset: -80,
        exact: true,
      },
      {
        to: "vision",
        text: "vision",
        duration: 500,
        spy: true,
        offset: -80,
        exact: true,
      },
      {
        to: "roadmap",
        text: "Roadmap",
        duration: 500,
        spy: true,
        offset: -80,
        exact: true,
      },
      {
        to: "team",
        text: "Team",
        duration: 500,
        spy: true,
        offset: -80,
        exact: true,
      },
      {
        to: "/cart",
        text: "Account",
        duration: 0,
        spy: false,
        offset: 0,
        exact: false,
      },
    ];
  } else if (location.pathname === "/generate") {
    navdata = [
      {
        to: "/",
        text: "Home",
        duration: 0,
        spy: false,
        offset: 0,
        exact: false,
      },
    ];
  } else if (
    location.pathname === "/cart" ||
    location.pathname === "/profile"
  ) {
    navdata = [
      {
        to: "/",
        text: "Home",
        duration: 0,
        spy: false,
        offset: 0,
        exact: false,
      },
      {
        to: "/cart",
        text: "Cart",
        duration: 0,
        spy: false,
        offset: 0,
        exact: false,
      },
      {
        to: "/profile",
        text: "Profile",
        duration: 0,
        spy: false,
        offset: 0,
        exact: false,
      },
    ];
  }
  const [scrollNav, setScrollNav] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSiderbar, setIsOpenSiderbar] = useState(false);
  const toggleSiderbar = () => {
    setIsOpenSiderbar(!isOpenSiderbar);
  };
  const changeNav = () => {
    if (window.scrollY >= 80) {
      setScrollNav(true);
    } else {
      setScrollNav(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeNav);
    return () => {
      window.removeEventListener("scroll", changeNav);
    };
  }, []);

  const toggleHome = () => {
    scroll.scrollToTop();
  };
  const clinetResize = () => {
    setClientWidth(window.document.body.clientWidth);
  };
  useEffect(() => {
    window.addEventListener("resize", clinetResize);
    return () => {
      window.removeEventListener("resize", clinetResize);
    };
  }, []);
  useEffect(() => {
    if (clientWidth < 800 && location.pathname === "/profile") {
      setShowNavbar(false);
    } else if (location.pathname.startsWith("/social/")) {
      setShowNavbar(false);
    } else if (location.pathname === "/nft") {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
  }, [clientWidth, location.pathname]);

  return (
    <>
      {showNavbar && (
        <>
          <Sidebar
            isOpen={isOpenSiderbar}
            toggle={toggleSiderbar}
            isMobile={clientWidth <= 1150}
          />
          <IconContext.Provider value={{ color: "#fff", paddingTop: "1rem" }}>
            <Nav scrollNav={scrollNav}>
              <NavbarContainer>
                <NavLogo onClick={toggleHome} to="/">
                  <img
                    src={logo}
                    style={{ height: "35px", paddingRight: "1rem" }}
                  ></img>
                  TurtleCase
                </NavLogo>
                <MobileIcon onClick={toggleSiderbar}>
                  <FaBars />
                </MobileIcon>
                <NavMenu>
                  {navdata.map((item, index) => {
                    if (location.pathname === "/") {
                      return item.to !== "/cart" ? (
                        <NavItem key={item.to}>
                          <NavLinks
                            to={item.to}
                            key={index}
                            smooth={true}
                            duration={item.duration}
                            spy={item.spy}
                            exact={item.exact.toString()}
                            offset={item.offset}
                          >
                            {item.text}
                          </NavLinks>
                        </NavItem>
                      ) : (
                        <NavItem key={item.to}>
                          <NavLinkRoute to={item.to} key={index}>
                            {item.text}
                          </NavLinkRoute>
                        </NavItem>
                      );
                    } else {
                      return (
                        <NavItem key={item.to}>
                          <NavLinkRoute to={item.to} key={index}>
                            {item.text}
                          </NavLinkRoute>
                        </NavItem>
                      );
                    }
                  })}
                </NavMenu>
                {clientWidth > 1150 && showWalletBtn && (
                  <NavBtn>
                    <ChakraProvider theme={theme}>
                      <Layout>
                        <ConnectButton
                          handleOpenModal={() => setIsOpen(true)}
                        />
                        <AccountModal
                          isOpen={isOpen}
                          onClose={() => setIsOpen(false)}
                        />
                      </Layout>
                    </ChakraProvider>
                  </NavBtn>
                )}
              </NavbarContainer>
            </Nav>
          </IconContext.Provider>
        </>
      )}
    </>
  );
};

export default Navbar;
