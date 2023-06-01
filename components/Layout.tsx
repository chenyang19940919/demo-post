import React from "react";
import "nprogress/nprogress.css";
import { Box, Toolbar, CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

interface Props {
  children?: React.ReactNode;
};



const sidebarWidth = 240;

const Layout = ({ children }: Props) => {

  const theme = createTheme({
    palette: {
      primary: {
        main:"#5966f3",
        contrastText: "#fff"
      },
      success: {
        main: "#30ba67",
        contrastText: "#fff",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex" }}>
        <Navbar width={sidebarWidth} />
        <Sidebar width={sidebarWidth} />
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 2 }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout;

export function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
}

