import React from "react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
  Tooltip,
  IconButton,
} from "@mui/material";
import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import { styled } from "@mui/material/styles";

interface Props  {
  width: number;
};

const AppBar = styled(MuiAppBar)(({ theme }) => {
  return {
    borderColor: "rgba(0, 0, 0,0.12)",
    borderStyle: "solid",
    borderWidth: 0,
    borderBottomWidth: "1px",
  };
});

const Navbar = ({ width }: Props) => {
  const router = useRouter();
  //const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut({ redirect: false });
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{ width: `calc(100% - ${width}px)`, ml: `${width}px` }}
    >
      <Toolbar>
        <Typography sx={{ flexGrow: 1 }}></Typography>
        <>
          <Tooltip title="Account Settings">
            <IconButton color="inherit" onClick={handleClick}>
              <Avatar />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              sx: {
                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem onClick={handleSignOut}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
