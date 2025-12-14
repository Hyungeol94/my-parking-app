import React from "react";
import Box from "@mui/material/Box";
import { CardMedia, Typography } from "@mui/material";
import { CommonButton } from "../../../UI/CommonButton";
import OrderTotalPrice from "./OrderTotalPrice";
import { useThemeSlice } from "../../../../store";
import MediaQuery from "../../../UI/MediaQuery";
import classes from "./OrderCard.module.css";

interface OrderCardProps {
  title: string;
  image: string | undefined;
  orderItems?: number; // 주문건 외 몇건
  startDate?: string; // 대여 시작 날짜
  endDate?: string; // 대여 종료 날짜
  buyDate?: string; // 구매날짜
  priceProduct?: number; // 각각의 상품 가격
  totalPrice?: number;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isVisible?: boolean; // 버튼보임 설정
  sellerId?: string; //구매자 아이디
  productPrice?: number; // 상품 개당가격
  flexDirection?: string;
  btnText?: string;
  disabled?: boolean;
}

const OrderCard: React.FC<OrderCardProps> = ({
  title,
  image,
  orderItems,
  endDate,
  startDate,
  buyDate,
  onClick,
  productPrice,
  totalPrice,
  isVisible = true,
  flexDirection,
  btnText,
  disabled,
  // sellerId,
}) => {
  const { isDark } = useThemeSlice();
  const isMobile = MediaQuery();
  {
    orderItems;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: " space-evenly",
          mt: "25px",
          mb: "25px",
          alignItems: "center",
          borderBottom: isDark
            ? "1px solid var(--color-gray-300)"
            : "1px solid var(--color-gray-300)",
          flexDirection: flexDirection ? flexDirection : null,
        }}
      >
        <Box
          sx={{
            flexBasis: "200px",
            margin: "10px",
            //모바일 일때 크기
            flex: isMobile ? 2 : undefined,
          }}
        >
          <div className={classes.orderDate}>
            {buyDate && (
              <div>
                <span>주문날짜</span> {buyDate}
              </div>
            )}
          </div>
          <CardMedia
            component="img"
            image={image}
            alt=""
            style={{
              borderRadius: "10px",
              marginTop: "20px",
              marginBottom: "20px",
            }}
          />
        </Box>
        <Box
          sx={{
            textAlign: "center",
            display: "flex",
            alignItems: "center",
            fontSize: isMobile ? "0.7rem" : undefined,
            width: "100%",
            justifyContent: "space-around",
            flex: 3,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "10px" : null,
          }}
        >
          {orderItems ? (
            <Typography
              className={classes.orderCardTitle}
              variant={isMobile ? "body2" : "body1"}
              sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              {/* 배열의 length가 1 이상일 때만 랜더링 */}
              {title} {orderItems >= 2 && `외 ${orderItems}`}
            </Typography>
          ) : (
            <Typography
              variant={isMobile ? "body2" : "body1"}
              sx={{ fontWeight: "bold", fontSize: "1.2rem" }}
            >
              {title}
            </Typography>
          )}
          {startDate && (
            <Box>
              <div>{startDate}</div>~<div>{endDate}</div>
            </Box>
          )}

          {/* <Box>{sellerId}</Box> */}
          {totalPrice ? (
            <OrderTotalPrice totalPrice={totalPrice} />
          ) : (
            <OrderTotalPrice productPrice={productPrice} />
          )}
          {isVisible && (
            <CommonButton
              text={btnText ? btnText : "상세보기"}
              onClick={onClick}
              isVisible={isVisible}
              disabled={disabled}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default OrderCard;
