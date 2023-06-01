import Head from "@/components/Head";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import { useRouter } from "next/router";
//import { getLayout } from "@/components/Layout";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <Head title="首頁" />
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Demo Post
            </Typography>
            <Button color="inherit" onClick={() =>router.push("/posts")}>進入後台</Button>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}

//Home.getLayout = getLayout;
