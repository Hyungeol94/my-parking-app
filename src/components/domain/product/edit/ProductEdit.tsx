import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShallow } from 'zustand/react/shallow';

import useCustomAxios from "../../../../services/useCustomAxios";
import { useAuthSlice, useThemeSlice } from "../../../../store";

import ProductForm from "../regist/ProductForm";
import Loading from "../../../common/Loading";

const ProductEdit = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const axiosInstance = useCustomAxios();
  const { setAlertText, setIsToastOpen } = useThemeSlice(
    useShallow((state) => ({ 
      setAlertText: state.setAlertText, 
      setIsToastOpen: state.setIsToastOpen 
    }))
  );
  const { userBasicInfo } = useAuthSlice();

  const [loading, setLoading] = useState(true);
  const [initialProduct, setInitialProduct] = useState<ProductItemType>({
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
  });

    useEffect(function queryProduct() {
      (async () => {
        try {
          const response = await axiosInstance<ProductItemResType>(
            `/products/${productId}`
          );
          const resItem = response.data.item;
          setInitialProduct({
            name: resItem.name,
            content: resItem.content,
            price: Number(resItem.price),
            mainImages: resItem.mainImages,
            extra: {
              startDate: resItem.extra?.startDate,
              endDate: resItem.extra?.endDate,
              address: resItem.extra?.address,
              lat: resItem.extra?.lat,
              lng: resItem.extra?.lng,
            },
          });
          setLoading(false);
        } catch (err) {
          console.error("해당 게시글을 불러오는데 실패하였습니다", err);
        }
    })();
  }, [productId]);


  const handleEditSumbit = async (
    updatedData: ProductItemType,
    updatedMainImages: mainImageType[] | undefined
  ) => {
    try {
      const sendAllData = {
        name: updatedData.name,
        content: updatedData.content,
        shippingFees: 0,
        price: Number(updatedData.price),
        mainImages: updatedMainImages,
        show: true, // 기본값
        active: true, // 기본값
        quantity: 1, // 기본값
        buyQuantity: 0, // 기본값
        extra: {
          startDate: updatedData.extra?.startDate,
          endDate: updatedData.extra?.endDate,
          address: updatedData.extra?.address,
          lat: Number(updatedData.extra?.lat),
          lng: Number(updatedData.extra?.lng),
          //판매자의 namer값
          sellerNickname: userBasicInfo.name,
        },
      };

      // 수정 요청
      const response = await axiosInstance.patch(
        `seller/products/${productId}`,
        sendAllData
      );

      if (response.data.ok === 1) {
        setIsToastOpen(true);
        setAlertText("상품수정이 완료되었습니다.");
        navigate(`/products/${productId}`);
      }
    } catch (error) {
      console.error("상품 수정에 실패하였습니다", error);
    }
  };

  if (loading) return <Loading />;
  return (
    <ProductForm
      title="수정"
      onSubmit={handleEditSumbit}
      product={initialProduct}
    />
  );
};

export default ProductEdit;
