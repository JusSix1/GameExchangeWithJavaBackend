import * as React from "react";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Drawer from "@mui/material/Drawer";
import "./UserFullAppBar.css";

// User Icon
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import ViewListIcon from "@mui/icons-material/ViewList";
import GradingIcon from "@mui/icons-material/Grading";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import DownloadDoneIcon from "@mui/icons-material/DownloadDone";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { Link as RouterLink } from "react-router-dom";
import { UsersInterface } from "../../models/user/IUser";
import ip_address from "../ip";
import { Avatar } from "@mui/material";
import { ReqSellersInterface } from "../../models/reqseller/IReqSeller";

function UserFullAppBar() {
  const [user, setUser] = React.useState<Partial<UsersInterface>>({});
  const [statusSeller, setStatusSeller] = React.useState<ReqSellersInterface>();
  const [noReq, setNoReq] = React.useState<boolean>();

  const signout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  function drawerList() {
    return (
      <List sx={{ width: "100%" }}>
        <ListItem button component={RouterLink} to="/">
          <HomeIcon />
          <ListItemText primary="Home" sx={{ paddingLeft: 1 }} />
        </ListItem>

        <ListItem button component={RouterLink} to="/MyBasket">
          <ShoppingBasketIcon />
          <ListItemText primary="My Basket" sx={{ paddingLeft: 1 }} />
        </ListItem>

        <ListItem button component={RouterLink} to="/AlreadyBought">
          <DownloadDoneIcon />
          <ListItemText primary="Already bought" sx={{ paddingLeft: 1 }} />
        </ListItem>

        <ListItem button component={RouterLink} to="/RequestGame">
          <AddCircleOutlineIcon />
          <ListItemText primary="Request Game" sx={{ paddingLeft: 1 }} />
        </ListItem>

        {!noReq && (statusSeller?.Is_Confirm || statusSeller?.Is_Cancel) ? (
          <>
            <ListItem button component={RouterLink} to="/GameAccount">
              <ViewListIcon />
              <ListItemText primary="Game Account" sx={{ paddingLeft: 1 }} />
            </ListItem>
            <ListItem button component={RouterLink} to="/MyOrder">
              <GradingIcon />
              <ListItemText primary="My Order" sx={{ paddingLeft: 1 }} />
            </ListItem>
          </>
        ) : null}

        <ListItem button component={RouterLink} to="/Status_Seller">
          <RequestPageIcon />
          {noReq ? (
            <ListItemText primary="Request seller" sx={{ paddingLeft: 1 }} />
          ) : (
            <ListItemText primary="Status seller" sx={{ paddingLeft: 1 }} />
          )}
        </ListItem>
      </List>
    );
  }

  function myProfileUser() {
    return (
      <MenuItem onClick={handleClose} component={RouterLink} to={"/MyProfile"}>
        My Profile
      </MenuItem>
    );
  }

  const [auth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

  const getUserProfilePicture = async () => {
    const apiUrl =
      ip_address() + "/usersprofilepicture/" + localStorage.getItem("email");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setUser(res.data);
        }
      });
  };

  const GetStatusSeller = async () => {
    const apiUrl =
      ip_address() + "/statusseller/" + localStorage.getItem("email");
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    await fetch(apiUrl, requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.data) {
          setStatusSeller(res.data);
          setNoReq(false);
        }
        if (res.error) {
          setNoReq(true);
        }
      });
  };

  React.useEffect(() => {
    const fetchData = async () => {
      await getUserProfilePicture();
      await GetStatusSeller();
    };
    fetchData();
  }, []);

  return (
    <nav className="nav-appbar">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setIsDrawerOpen(true)}
        >
          <MenuIcon style={{ color: "#FFF" }} />
        </IconButton>

        <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
          <SportsEsportsIcon
            color="primary"
            sx={{
              fontSize: 150,
              margin: 1,
              padding: 2,
              color: "rgba(2, 245, 255, 1)",
            }}
          />
          {/** List of Drawer Divided by position */}
          {drawerList()}
        </Drawer>

        <div className="logo">
          <a href="/">
            G<span>a</span>meEx<span>ch</span>ange
          </a>
        </div>

        {auth /* รูป Icon Profild */ && (
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar
                alt="Remy Sharp"
                src={`${user.Profile_Picture}`}
                style={{ boxShadow: "0px 0px 10px 5px #FFF01F" }}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              {myProfileUser()}
              {/*  for user */}
              <MenuItem onClick={signout} component={RouterLink} to="/">
                Logout
              </MenuItem>
            </Menu>
          </div>
        )}
      </Toolbar>
    </nav>
  );
}

export default UserFullAppBar;
