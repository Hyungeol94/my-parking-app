import { useNavigate } from "react-router-dom";

import ProductForm from "./ProductForm";
import useCustomAxios from "../../../../services/useCustomAxios";
import { useAuthSlice, useThemeSlice } from "../../../../store/index";

const ProductRegist = () => {
  const navigate = useNavigate();
  const axiosInstance = useCustomAxios();
  const { setAlertText, setIsToastOpen } = useThemeSlice();

  //로그인 한 user의 name
  const { userBasicInfo } = useAuthSlice();

  const initialProduct: ProductItemType = {
    name: "",
    content: "",
    price: 0,
    mainImages: [],
    extra: {
      startDate: "",
      endDate: "",
      address: "",
      lat: undefined,
      lng: undefined,
    },
  };

  const handleSubmit = async (
    data: ProductItemType,
    mainImages: mainImageType[] | undefined
  ) => {
    if (!data.extra) return alert("모든 양식을 채워 주어야 합니다.");

    try {
      const sendAllData = {
        name: data.name,
        content: data.content,
        shippingFees: 0,
        price: Number(data.price),
        mainImages: mainImages,
        show: true, // 기본값
        active: true, // 기본값
        quantity: 1, // 기본값
        buyQuantity: 0, // 기본값
        extra: {
          startDate: data.extra?.startDate,
          endDate: data.extra?.endDate,
          address: data.extra?.address,
          lat: Number(data.extra?.lat),
          lng: Number(data.extra?.lng),
          //판매자의 namer값
          sellerNickname: userBasicInfo.name,
        },
      };

      const response = await axiosInstance.post(
        `/seller/products`,
        sendAllData
      );

      if (response.data.ok === 1) {
        setIsToastOpen(true);
        setAlertText("상품등록이 완료되었습니다.");
        navigate("/home");
      }
    } catch (error) {
      console.error("상품을 등록하는데 문제가 발생했습니다.", error);
    }
  };

  return (
    <>
      <ProductForm
        title="등록"
        onSubmit={handleSubmit}
        product={initialProduct}
      />
    </>
  );
};

export default ProductRegist;
