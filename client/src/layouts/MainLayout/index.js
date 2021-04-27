import { Box } from "grommet";
import React from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import Container from "../../components/Container";

const MainLayout = ({ centered, children }) => (
  <Box
    direction={"column"}
    justify={"between"}
    style={{ minHeight: "100vh" }}
    width={"100%"}
  >
    <NavBar />
    <Box
      align={centered ? "center" : "start"}
      flex={{ grow: 1, shrink: 0 }}
      justify={centered ? "center" : "start"}
      margin={"medium"}
    >
      <Container>{children}</Container>
    </Box>
    <Footer />
  </Box>
);

export default MainLayout;
