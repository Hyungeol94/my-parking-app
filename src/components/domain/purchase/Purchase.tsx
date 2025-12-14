import React, { useState } from "react";
import PurchaseForm from "./PurchaseForm";
import OrderCard from "../order-history/ordercard/OrderCard";
import { usePurchaseSlice, useThemeSlice } from "../../../store";
import { BASE_URL } from "../../../services/BaseUrl";
import classes from "./purchase.module.css";
import MediaQuery from "../../UI/MediaQuery";
import { Toast } from "../../UI/Toast";
import PaymentMethod from "./PaymentMethod";

const Purchase = () => {
  const isMobile = MediaQuery();
  const { productDetailData } = usePurchaseSlice();
  const [checked, setChecked] = useState({ name: "", value: false });

  const { isToastOpen, alertText, bgColor } = useThemeSlice();

  const handleOnChange = (
    e:
      | React.SyntheticEvent<Element, Event>
      | React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedValue = (e as React.ChangeEvent<HTMLInputElement>).target
      .value;

    //체크된 라디오 버튼이 있는지 검사
    setChecked((prev) => ({
      ...prev,
      name: selectedValue,
      value: true,
    }));
  };

  return (
    <>
      {isMobile || (
        <div className={classes.purchaseContainer}>
          <ul>
            <li>상품정보</li>
            <li>대여기간</li>
            <li>결제금액</li>
          </ul>
        </div>
      )}

      <OrderCard
        title={productDetailData.name}
        image={BASE_URL + productDetailData.mainImages[0].url}
        totalPrice={productDetailData.price}
        isVisible={false}
        startDate={productDetailData.extra.startDate}
        endDate={productDetailData.extra.endDate}
        sellerId={productDetailData.seller_id}
      />
      <PurchaseForm onChange={handleOnChange} total={productDetailData.price} />
      {/* paymentOption 에 따라 결제 방식이 달라집니다. */}
      <PaymentMethod disabled={!checked.value} paymentOption={checked.name} />
      <Toast
        isToastOpen={isToastOpen}
        alertText={alertText}
        bgColor={bgColor}
      />
    </>
  );
};

export default Purchase;
