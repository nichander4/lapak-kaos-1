import React, { useContext, useEffect, useReducer } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";
import { getError } from "../../utils/error";
import Chart from '@mui/icons-material/BarChartOutlined'
import Orders from '@mui/icons-material/AssignmentOutlined'
import Products from '@mui/icons-material/Inventory2Outlined'
import Users from '@mui/icons-material/PeopleAltOutlined'
import { grey } from "@mui/material/colors";
import Head from "next/head";
import NextLink from "next/link";
import {
  Button,
  Typography,
  Grid,
  Card,
  List,
  ListItem,
  CircularProgress,
  CardContent,
  CardActions,
} from "@mui/material";
// import { Bar } from "react-chartjs-2";
import styled from "../../styles/layout.module.css";


function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, summary: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
const AdminDashboard = () => {
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;

  const [{ loading, error, summary }, dispatch] = useReducer(reducer, {
    loading: true,
    summary: { salesData: [] },
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }

    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/summary`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Order History</title>
      </Head>

      <Grid container spacing={1}>
        <Grid item md={3} xs={12}>
          <Card className={styled.section}>
            <List>
              <NextLink href="/admin/dashboard" passHref>
                <ListItem selected button component="a">
                <Grid container direction="row" alignItems="center"><Chart sx={{color: grey[500], marginRight: '10px'}}/> Admin Dashboard</Grid> 
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem button component="a">
                <Grid container direction="row" alignItems="center"><Orders sx={{color: grey[500], marginRight: '10px'}}/> Orders</Grid> 
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                <Grid container direction="row" alignItems="center"><Products sx={{color: grey[500], marginRight: '10px'}}/> Products</Grid> 
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem button component="a">
                <Grid container direction="row" alignItems="center"><Users sx={{color: grey[500], marginRight: '10px'}}/> Users</Grid> 
                </ListItem>
              </NextLink>
            </List>
          </Card>
        </Grid>

        <Grid item md={9} xs={12}>
          <Card className={styled.section}>
            <List>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={styled.error}>{error}</Typography>
                ) : (
                  <Grid container spacing={5}>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            Rp. {summary.ordersPrice}
                          </Typography>
                          <Typography>Sales</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink
                            href="/admin/orders"
                            color="primary"
                            passHref
                          >
                            <Button size="small" color="primary" variant="contained">
                              View Sales
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.ordersCount}
                          </Typography>
                          <Typography>Orders</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink
                            href="/admin/orders"
                            color="primary"
                            passHref
                          >
                            <Button size="small" color="primary" variant="contained">
                              View Orders
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.productsCount}
                          </Typography>
                          <Typography>Products</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink
                            href="/admin/products"
                            color="primary"
                            passHref
                          >
                            <Button size="small" color="primary" variant="contained">
                              View Products
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                    <Grid item md={3}>
                      <Card raised>
                        <CardContent>
                          <Typography variant="h1">
                            {summary.usersCount}
                          </Typography>
                          <Typography>Users</Typography>
                        </CardContent>
                        <CardActions>
                          <NextLink
                            href="/admin/users"
                            color="primary"
                            passHref
                          >
                            <Button size="small" color="primary" variant="contained">
                              View Users
                            </Button>
                          </NextLink>
                        </CardActions>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </ListItem>
              {/* <ListItem>
                <Typography component="h1" variant="h1">
                  Sales Chart
                </Typography>
              </ListItem>
              <ListItem>
                <Bar
                  data={{
                    labels: summary.salesData.map((x) => x._id),
                    datasets: [
                      {
                        label: "Sales",
                        backgroundColor: "rgba(162, 222, 208, 1)",
                        data: summary.salesData.map((x) => x.totalSales),
                      },
                    ],
                  }}
                  options={{ legend: { display: true, position: "right" } }}
                ></Bar>
              </ListItem> */}
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default dynamic(() => Promise.resolve(AdminDashboard), { ssr: false });
