import React, { useContext } from "react";
import Head from "next/head";
import { Button, Card, Grid, List, ListItem, Typography } from "@mui/material";
import Image from "next/image";
import db from "../../utils/db";
import Product from "../../models/Product";
import axios from "axios";
import { Store } from "../../utils/Store";
import { useRouter } from "next/router";
import Star from '@mui/icons-material/StarOutlined'
import { yellow } from "@mui/material/colors";

const ProductDetails = (props) => {
  const router = useRouter();
  const { state, dispatch } = useContext(Store);
  const { product } = props;

  if (!product) {
    return <div>Product Not Found</div>;
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Sorry. Product is out of stock");
      return;
    }
    dispatch({ type: "CART_ADD_ITEM", payload: { ...product, quantity } });
    router.push("/cart");
  };

  return (
    <div>
      <Head>
        <title>{product.name}</title>
      </Head>
      <Grid container spacing={2}>
        <Grid item md={4} xs={12}>
          <Image
            src={product.image}
            alt={product.name}
            width={640}
            height={640}
            layout="responsive"
          ></Image>
        </Grid>
        <Grid item md={5} xs={12}>
          <List>
            <ListItem style={{borderBottom: '1px solid rgba(0, 0, 0, .3)'}}>
              

              <Typography>

              <Typography component="h1" variant="h1">
                <b>{product.name}</b>
              </Typography>
             
           
              <Grid container direction="row" alignItems="center"  style={{marginTop: '10px'}}><Star sx={{ color: yellow[500], marginRight: '3px' }}/> {product.rating} ({product.numReviews} reviews)</Grid>
              
          
              </Typography>
            </ListItem>
            <ListItem>
              <Typography>Category : {product.category}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Brand : {product.brand}</Typography>
            </ListItem>
            <ListItem>
              <Typography>Description : {product.description}</Typography>
            </ListItem>
          </List>
        </Grid>
        <Grid item md={3} xs={12}>
          <Card>
            <List>
              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography><b>Price</b></Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography><b>Rp. {product.price}</b> </Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Grid container>
                  <Grid item xs={6}>
                    <Typography>Status</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>
                      {product.countInStock > 0 ? "In Stock" : "Unavailable"}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={addToCartHandler}
                >
                  <b>

                  + Add to Cart
                  </b>
                </Button>
              </ListItem>
            </List>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProductDetails;

export const getServerSideProps = async (context) => {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();
  return {
    props: {
      product: db.convertDocToObj(product),
    },
  };
};
