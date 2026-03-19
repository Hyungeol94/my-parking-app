// 유저가 seller일때 마이프로덕트페이지에서 본인의 판매 상품 리스트를 보여주는 컴포넌트입니다.
import { useEffect, useState } from "react";

import classes from "./MyProductList.module.css";
import Loading from "../../../common/Loading";
import {useMyPageSlice } from "../../../../store";
import MediaQueryMain from "../../../UI/MediaQueryMain";
import ProductList from "./ProductList";
import { Box } from "@mui/material";

const MyProductList = () => {
  const [loading, setLoading] = useState(true);
  const isMobile = MediaQueryMain();
  const getMyProducts = useMyPageSlice().getMyProducts
  const [myProducts, setMyProducts] = useState<ProductListType>([]);

  useEffect(function queryProducts () {
    const fn = async () => {
      setLoading(true);
      setMyProducts(await getMyProducts());
      setLoading(false);
    };

    fn();
  }, []);

  return (
    <>
      <h2 className={classes.myProductList}>내 상품 목록</h2>
      {loading ? (
        <Loading />
      ) : (
        <Box>
          <ProductList
            products={myProducts}
            isMobile={isMobile}
            isMyList={true}
          />
        </Box>
      )}
    </>
  );
};

export default MyProductList;
