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
import Edit from '@mui/icons-material/EditOutlined'
import Delete from '@mui/icons-material/DeleteForeverRounded'
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
import { useSnackbar } from "notistack";

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, users: action.payload, error: "" };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      state;
  }
}
const AdminUsers = () => {
  const { state } = useContext(Store);
  const router = useRouter();
  const { userInfo } = state;

  const [{ loading, error, users, successDelete, loadingDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: "",
    });

  useEffect(() => {
    if (!userInfo) {
      router.push("/login");
    }

    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/admin/users`, {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchData();
    }
  }, [successDelete]);

  const { enqueueSnackbar } = useSnackbar();

  const deleteHandler = async (userId) => {
    if (!window.confirm("Are you sure?")) {
      return;
    }
    try {
      dispatch({ type: "DELETE_REQUEST" });
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({ type: "DELETE_SUCCESS" });
      enqueueSnackbar("User deleted succesfully", { variant: "success" });
    } catch (err) {
      dispatch({ type: "DELETE_FAIL" });
      enqueueSnackbar(getError(err), { variant: "error" });
    }
  };

  return (
    <>
      <Head>
        <title>Users</title>
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
                <ListItem  button component="a">
                <Grid container direction="row" alignItems="center"><Orders sx={{color: grey[500], marginRight: '10px'}}/> Orders</Grid> 
                </ListItem>
              </NextLink>
              <NextLink href="/admin/products" passHref>
                <ListItem button component="a">
                <Grid container direction="row" alignItems="center"><Products sx={{color: grey[500], marginRight: '10px'}}/> Products</Grid> 
                </ListItem>
              </NextLink>
              <NextLink href="/admin/users" passHref>
                <ListItem selected button component="a">
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
                  Users
                </Typography>
                {loadingDelete && <CircularProgress />}
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
                          <TableCell>NAME</TableCell>
                          <TableCell>EMAIL</TableCell>
                          <TableCell align="center">IS ADMIN</TableCell>
                          <TableCell align="center">ACTION</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user._id}>
                            <TableCell>{user._id.substring(20, 24)}</TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell align="center">{user.isAdmin?'YES':'NO'}</TableCell>
                            <TableCell align="center">
                              <NextLink
                                href={`/admin/user/${user._id}`}
                                passHref
                              >
                                <Button size="small" variant="contained" startIcon={<Edit/>}>
                                  Edit
                                </Button>
                              </NextLink>{" "}
                              <Button
                                onClick={() => deleteHandler(user._id)}
                                size="small"
                                color="secondary"
                                startIcon={<Delete/>}
                                variant="contained"
                              >
                                Delete
                              </Button>
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

export default dynamic(() => Promise.resolve(AdminUsers), { ssr: false });
