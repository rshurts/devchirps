import { Anchor, Box, Heading, Menu } from "grommet";
import { Menu as MenuIcon } from "grommet-icons";
import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const NavBar = () => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <header>
      <Box
        align={"center"}
        border={{
          color: "light-4",
          size: "xsmall",
          style: "solid",
          side: "bottom",
        }}
        direction={"row"}
        justify={"between"}
        pad={"small"}
      >
        <Heading color={"brand"} level={"1"} size={"32px"}>
          <Anchor href={"/"} label={"devchirps"} primary />
        </Heading>
        {location.pathname !== "/" && (
          <Menu
            a11yTitle={"User Menu"}
            dropAlign={{ right: "right", top: "top" }}
            icon={<MenuIcon color={"brand"} size={"20px"} />}
            items={[{ label: "Logout", onClick: logout }]}
            justifyContent={"end"}
          />
        )}
      </Box>
    </header>
  );
};

export default NavBar;
