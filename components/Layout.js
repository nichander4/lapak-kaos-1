import {
  AppBar,
  Badge,
  Container,
  createTheme,
  CssBaseline,
  Link,
  Switch,
  ThemeProvider,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Grid,
} from "@mui/material";
import Head from "next/head";
import NextLink from "next/link";
import React, { useContext, useState } from "react";
import styled from "../styles/layout.module.css";
import { Store } from "../utils/Store";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Cart from '@mui/icons-material/ShoppingCartOutlined'
import Login from '@mui/icons-material/LoginOutlined'
import Mode from '@mui/icons-material/TungstenRounded'
import Profile from '@mui/icons-material/AccountCircleRounded'
import UpdateProfile from '@mui/icons-material/ManageAccountsOutlined'
import History from '@mui/icons-material/HistoryOutlined'
import Admin from '@mui/icons-material/AdminPanelSettingsOutlined'
import Logout from '@mui/icons-material/LogoutOutlined'
import { grey } from "@mui/material/colors";



const Layout = (props) => {
  const Router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { darkMode, cart, userInfo } = state;
  const theme = createTheme({
    typography: {
      h1: {
        fontSize: "1.6rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
      h2: {
        fontSize: "1.4rem",
        fontWeight: 400,
        margin: "1rem 0",
      },
    },
    palette: {
      mode: darkMode ? "dark" : "light",
      primary: {
        main: "#95CD41",
      },
      secondary: {
        main: "#f44336",
      },
    },
  });

  const darkModeChangeHandler = () => {
    dispatch({ type: darkMode ? 'DARK_MODE_OFF' : 'DARK_MODE_ON' });
    const newDarkMode = !darkMode;
    Cookies.set('darkMode', newDarkMode ? 'ON' : 'OFF');
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const loginClickHandler = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const loginMenuCloseHandler = (e, redirect) => {
    setAnchorEl(null);
    if (redirect) {
      Router.push(redirect);
    }
  };

  const logoutClickHandler = () => {
    setAnchorEl(null);
    dispatch({ type: "USER_LOGOUT" });
    Cookies.remove("userInfo");
    Cookies.remove("cartItems");
    Router.push("/");
  };

  return (
    <div>
      <Head>
        <title>Lapak Kaos</title>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" className={styled.navbar}>
          <Toolbar>
            <NextLink href={"/"} passHref>
              <Link>
                <Typography className={styled.brand}>Lapak Kaos</Typography>
              </Link>
            </NextLink>
            <div className={styled.grow}></div>
            <div className={styled.space}>

           
                    <Mode sx={{ color: 'white' }}/>  
                  <Switch
                      checked={darkMode}
                      onChange={darkModeChangeHandler}
                      >
                    </Switch>

              <NextLink href={"/cart"} passHref>
                <Link>
                  {cart.cartItems.length > 0 ? (
                    <Badge
                      color="secondary"
                      badgeContent={cart.cartItems.length}
                    >
                      <Button startIcon={<Cart fontSize="large"/>} className={styled.btn}>Cart</Button>
                    </Badge>
                  ) : (
                    <Button startIcon={<Cart fontSize="large"/>} className={styled.btn}>Cart</Button>
                  )}
                </Link>
              </NextLink>
              {userInfo ? (
                <>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={loginClickHandler}
                    className={styled.navbarButton}
                  >
                    <Grid container direction="row" alignItems="center"><Profile sx={{marginRight: '3px'}}/> {userInfo.name}</Grid>
                  
                  </Button>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={loginMenuCloseHandler}
                    
                  >
                    <MenuItem
                      onClick={(e) => loginMenuCloseHandler(e, "/profile")}
                    >
                    <Grid container direction="row" alignItems="center"><UpdateProfile sx={{color: grey[500], marginRight: '10px'}}/> Update Profile</Grid> 
                    </MenuItem>
                    <MenuItem
                      onClick={(e) =>
                        loginMenuCloseHandler(e, "/order-history")
                      }
                    >
                      <Grid container direction="row" alignItems="center"><History sx={{color: grey[500], marginRight: '10px'}}/> Order History</Grid> 
                    </MenuItem>
                    {userInfo.isAdmin && (
                      <MenuItem
                        onClick={(e) =>
                          loginMenuCloseHandler(e, "/admin/dashboard")
                        }
                      >
                        <Grid container direction="row" alignItems="center"><Admin sx={{color: grey[500], marginRight: '10px'}}/> Admin Dashboard</Grid> 
                      </MenuItem>
                    )}
                    <MenuItem onClick={logoutClickHandler}>
                    <Grid container direction="row" alignItems="center"><Logout sx={{color: grey[500], marginRight: '10px'}}/> Logout</Grid>
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <NextLink href="/login" passHref>
                  <Link>
                  <Button
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    className={styled.navbarButton}
                  >
                    <Grid container direction="row" alignItems="center"><Login sx={{marginRight: '3px'}}/> Login</Grid>
                  </Button>
                  </Link>
                </NextLink>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <Container className={styled.main}>{props.children}</Container>

        <footer className={styled.footer}>
          <Typography>All rights reserved. Lapak Kaos.</Typography>
        </footer>
      </ThemeProvider>
    </div>
  );
};

export default Layout;
