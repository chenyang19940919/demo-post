import React from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Box,
  Drawer,
  Divider,
  Toolbar,
  List,
  ListSubheader,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Collapse,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AddIcon from '@mui/icons-material/Add'
import ArticleIcon from '@mui/icons-material/Article';

interface Props {
  width: number;
}

interface NestedListData {
  id: string;
  name: string;
  icon: any;
  path: string;
  children?: NestedListData[];
}

const menuData = [
  {
    id: "1",
    name: "文章",
    icon: ArticleIcon,
    path: "/posts",
  },
]


const NestedList = styled(List)<{ component?: React.ElementType }>(
  ({ theme }) => ({
    "& .Mui-selected": {
      color: theme.palette.primary.main,
      borderInlineEndStyle: "solid",
      borderInlineEndWidth: "2px",
    },
    "& .Mui-selected > .MuiListItemIcon-root": {
      color: theme.palette.primary.main,
    },
  })
);

const NestedListItem = (data: NestedListData): JSX.Element => {
  const router = useRouter();
  const currentUrl = usePathname();
  const [open, setOpen] = React.useState(() => {
    if (data.children && data.children.length > 0) {
      const result = data.children.filter((child) => child.path === currentUrl);
      return result.length > 0;
    }
    return false;
  });

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment key={data.id}>
      {data.children && data.children.length > 0 ? (
        <>
          <ListItemButton onClick={handleClick}>
            {data.icon && (
              <ListItemIcon>
                {React.createElement(data.icon)}
              </ListItemIcon>
            )}
            <ListItemText primary={data.name} />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <NestedList component="div" disablePadding>
              {data.children.map((child) => (
                <React.Fragment key={child.id}>
                  <ListItemButton
                    selected={currentUrl === child.path}
                    onClick={() => router.push(child.path)}
                  >
                    <ListItemText inset primary={child.name} />
                  </ListItemButton>
                </React.Fragment>
              ))}
            </NestedList>
          </Collapse>
        </>
      ) : (
        <ListItemButton
          selected={currentUrl === data.path}
          onClick={() => router.push(data.path)}
        >
          {data.icon && (
            <ListItemIcon>
              {React.createElement(data.icon)}
            </ListItemIcon>
          )}
          <ListItemText primary={data.name} />
        </ListItemButton>
      )}
    </React.Fragment>
  );
};

const Sidebar = ({ width }: Props) => {
  const router = useRouter();
  return (
    <Box component="nav" sx={{ width: { sm: width }, flexShrink: { sm: 0 } }}>
      <Drawer
        variant="permanent"
        sx={{
          width: width,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: width,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            Demo Post 後台
          </Typography>
        </Toolbar>
        {/* <Divider /> */}
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          sx={{
            borderRadius: "32px",
            width: "150px",
            height: "40px",
            margin: "16px",
          }}
          onClick={() => router.push("/post/edit")}
        >
          新增文章
        </Button>
        <NestedList component="nav" disablePadding>
          {menuData.map((item) => NestedListItem(item))}
        </NestedList>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
