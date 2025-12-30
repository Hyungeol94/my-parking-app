import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ProductItem from "./ProductItem";
import { useAuthSlice } from "../../../../store";

import classes from "./ProductList.module.css";
import { IconButton } from "@mui/material";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Toggle from "../../../layouts/Toggle";

type Props = {
  products: ProductListType | undefined;
  isMobile: boolean;
  isMyList?: boolean;
  isLoading?: boolean;
};
const ProductList = ({ products, isMobile, isMyList, isLoading }: Props) => {
  const navigate = useNavigate();
  const { userBasicInfo: user } = useAuthSlice();

  const [selectValue, setSelectValue] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<
    ProductListType | undefined
  >(products);

  // 필터 셀렉터 체인지 헨들러 함수
  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectValue(event.target.value as string);
  };

  // 상품 등록페이지 이동 함수
  const handleMoveRegist = () => {
    if (user.type === "seller") {
      navigate("/products/regist");
    } else {
      alert("판매자로 가입한 회원만 등록이 가능합니다.");
      if (confirm("판매자로 회원가입을 하시겠습니까?")) {
        navigate("/signup");
      }
    }
  };

  // 오늘 날짜 추출 함수
  const getTodayDate = (): string => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleFiltering = () => {
    if (products) {
      switch (selectValue) {
        case "latestStartDate":
          // 오늘 날짜 이전의 상품들은 제거후 정렬
          setFilteredProducts(
            [...products]
              .filter(
                (product) =>
                  (product.extra?.startDate as string | undefined) &&
                  (product.extra?.startDate as string) >= getTodayDate()
              )
              .sort(
                (a, b) =>
                  Number(a.extra?.startDate) - Number(b.extra?.startDate)
              )
          );
          break;
        case "latestCreatedAt":
          // 최근 등록한 상품글이 먼저 오게 정렬
          setFilteredProducts(
            [...products].sort(
              (a, b) =>
                new Date(b.createdAt as string).getTime() -
                new Date(a.createdAt as string).getTime()
            )
          );
          break;
        case "lowPrice":
          // 가격이 낮은것부터(오름차순)으로 정렬
          setFilteredProducts([...products].sort((a, b) => a.price - b.price));
          break;
        case "choise":
          // 선택이라는 항목을 클릭하면 기존 초기 상품리스트 출력
          setFilteredProducts(products);
          break;
        default:
          // 어떤 케이스에도 포함되지 않는다면 기존 초기 상품리스트 출력
          setFilteredProducts(products);
          break;
      }
    }
  };

  useEffect(() => {
    handleFiltering();
  }, [selectValue, products]);

  return (
    <>
      {isMobile ? (
        <Box
          sx={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: isMobile || isMyList ? "auto" : "400px",
          }}
          className={classes.containerMobile}
        >
          <div className={classes["product-utils"]}>
            <Toggle />
            <IconButton size="large" onClick={handleMoveRegist}>
              <AddLocationIcon
                fontSize="large"
                sx={{ color: "var(--color-primary-600)" }}
              />
            </IconButton>

            <Box sx={{ minWidth: 100 }}>
              <FormControl fullWidth>
                <InputLabel id="filter">필터</InputLabel>
                <Select
                  labelId="filter"
                  id="filter-select"
                  label="filter"
                  value={selectValue}
                  open={open}
                  onClose={() => setOpen(false)}
                  onOpen={() => setOpen(true)}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="choice">선택</MenuItem>
                  <MenuItem value="latestStartDate">대여날짜순</MenuItem>
                  <MenuItem value="latestCreatedAt">최신등록순</MenuItem>
                  <MenuItem value="lowPrice">저렴한순</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          {isLoading && (
            <Box
              sx={{
                padding: "12px",
                textAlign: "center",
                color: "var(--color-primary-600)",
                fontWeight: "500",
              }}
            >
              상품을 검색하는 중이에요🔍
            </Box>
          )}

          <ul className={classes["product-list"]}>
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                return <ProductItem key={product._id} product={product} />;
              })
            ) : !isLoading ? (
              <p>해당 위치와 날짜에 등록된 주차장이 없어요😭</p>
            ) : null}
          </ul>
        </Box>
      ) : (
        <Box
          sx={{
            padding: "15px",
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            width: isMobile || isMyList ? "auto" : "400px",
          }}
          className={classes.container}
        >
          <div className={classes["product-utils"]}>
            <Toggle />
            <IconButton size="medium" onClick={handleMoveRegist}>
              <AddLocationIcon
                fontSize="large"
                sx={{
                  color: "var(--color-white)",
                  borderRadius: "10px",
                }}
              />
            </IconButton>

            <Box sx={{ minWidth: 100 }}>
              <FormControl fullWidth>
                <InputLabel id="filter">필터</InputLabel>
                <Select
                  labelId="filter"
                  id="filter-select"
                  label="filter"
                  value={selectValue}
                  open={open}
                  onClose={() => setOpen(false)}
                  onOpen={() => setOpen(true)}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="choice">선택</MenuItem>
                  <MenuItem value="latestStartDate">대여날짜순</MenuItem>
                  <MenuItem value="latestCreatedAt">최신등록순</MenuItem>
                  <MenuItem value="lowPrice">저렴한순</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </div>

          {isLoading && (
            <Box
              sx={{
                padding: "12px",
                textAlign: "center",
                color: "var(--color-primary-600)",
                fontWeight: "500",
              }}
            >
              상품을 검색하는 중이에요🔍
            </Box>
          )}

          <ul className={classes["product-list"]}>
            {filteredProducts && filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                return <ProductItem key={product._id} product={product} />;
              })
            ) : !isLoading ? (
              <p>해당 위치와 날짜에 등록된 주차장이 없어요😭</p>
            ) : null}
          </ul>
        </Box>
      )}
    </>
  );
};

export default ProductList;

// setFilteredProducts(
//   [...products].sort((a, b) => {
//     const today = new Date();
//     const startDateA = new Date(a.extra?.startDate as string);
//     const startDateB = new Date(b.extra?.startDate as string);

//     // 오늘시간과 시작시간 절댓값 차이를 비교
//     const diffA = Math.abs(today.getTime() - startDateA.getTime());
//     const diffB = Math.abs(today.getTime() - startDateB.getTime());

//     return diffA - diffB;
//   })
// );
