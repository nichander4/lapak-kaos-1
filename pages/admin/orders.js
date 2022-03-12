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
  CircularProgress,
  Grid,
  List,
  ListItem,
  Typography,
  Card,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import styled from "../../styles/layout.module.css";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, orders: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      state;
  }
}
const AdminOrders = () => {
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: "",
  });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }

    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/orders`, {
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
                <ListItem  button component="a">
                <Grid container direction="row" alignItems="center"><Chart sx={{color: grey[500], marginRight: '10px'}}/> Admin Dashboard</Grid> 
                </ListItem>
              </NextLink>
              <NextLink href="/admin/orders" passHref>
                <ListItem selected button component="a">
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
                <Typography component="h1" variant="h1">
                  Orders
                </Typography>
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : error ? (
                  <Typography className={styled.error}>{error}</Typography>
                ) : (
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>ID</TableCell>
                          <TableCell>USER</TableCell>
                          <TableCell>DATE</TableCell>
                          <TableCell>TOTAL</TableCell>
                          <TableCell align="center">PAID</TableCell>
                          <TableCell align="center">DELIVERED</TableCell>
                          <TableCell align="center">ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order._id}>
                            <TableCell>{order._id.substring(20, 24)}</TableCell>
                            <TableCell>
                              {order.user ? order.user.name : "Deleted User"}
                            </TableCell>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell >Rp. {order.totalPrice}</TableCell>
                            <TableCell align="center">
                              {order.isPaid
                                ? `paid at ${order.paidAt}`
                                : "not paid"}
                            </TableCell>
                            <TableCell align="center">
                              {order.isDelivered
                                ? `delivered at ${order.deliveredAt}`
                                : "not delivered"}
                            </TableCell>
                            <TableCell align="center">
                              <NextLink href={`/order/${order._id}`} passHref>
                                <Button variant="contained">Details</Button>
                              </NextLink>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default dynamic(() => Promise.resolve(AdminOrders), { ssr: false });
