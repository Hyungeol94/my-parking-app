import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import MainImagesComponent from "./MainImagesComponent";
import SellerInfoComponent from "./SellerInfoComponent";
import DetailComponent from "./DetailComponent";
import PriceAndBtnComponent from "./PriceAndBtnComponent";

import classes from "./ProductDetail.module.css";
import Loading from "../../../common/Loading";
import useCustomAxios from "../../../../services/useCustomAxios";
import { useBoundStore } from "../../../../store";

const ProductDetail = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const axiosInstance = useCustomAxios();

  const [loading, setLoading] = useState(true);
  const [productData, setProductData] = useState<ProductItemType>({
    seller_id: 0,
    name: "",
    content: "",
    price: 0,
    mainImages: [],
    createdAt: "",
    extra: {
      startDate: "",
      endDate: "",
      address: "",
      lat: 0,
      lng: 0,
      sellerNickname: "",
    },
    replies: [],
  });

  const setProductDetailData = useBoundStore(
    (state) => state.setProductDetailData
  );

  const user = useBoundStore((state) => state.userBasicInfo);

  // 로그인한 유저가 판매자이면서, 본인이 작성한 글일때만 수정,삭제 버튼 나오는 상태변수 선언
  const isRightUser =
    user.type === "seller" && user._id === productData.seller_id;

  const handleGetProduct = async () => {
    try {
      const response = await axiosInstance<ProductItemResType>(
        `/products/${productId}`
      );
      const resItem = response.data.item;
      console.log(resItem);

      setProductData({
        seller_id: resItem.seller_id,
        name: resItem.name,
        content: resItem.content,
        createdAt: resItem.createdAt,
        mainImages: resItem.mainImages,
        price: resItem.price,
        extra: resItem.extra,
        replies: resItem.replies,
      });
      setLoading(false);

      //PurchaseSlice에 저장 및 업데이트
      setProductDetailData({
        seller_id: resItem.seller_id,
        name: resItem.name,
        content: resItem.content,
        createdAt: resItem.createdAt,
        mainImages: resItem.mainImages,
        price: resItem.price,
        extra: resItem.extra,
        replies: resItem.replies,
        _id: resItem._id,
        quantity: resItem.quantity,
      });
    } catch (err) {
      console.error("해당 게시글을 불러오는데 실패하였습니다", err);
    }
  };

  const handleRemoveProduct = async (id: string | undefined) => {
    try {
      await axiosInstance.delete(`/seller/products/${id}`);

      alert("해당 상품이 정상적으로 삭제되었습니다.");
      navigate(-1);
    } catch (err) {
      console.error("해당 상품글 삭제중 문제가 발생하였습니다.", err);
    }
  };

  useEffect(() => {
    handleGetProduct();
  }, [productId]);

  if (loading) return <Loading />;
  return (
    <div className={classes.container}>
      {/* 상품 이미지 컴포넌트 */}
      <MainImagesComponent product={productData} />
      {/* 판매자 정보 컴포넌트 */}
      <SellerInfoComponent product={productData} />
      {/*추후 헤더에 들어갈 삭제 수정하는 엑션 버튼들 컴포넌트로 만들예정*/}
      {isRightUser && (
        <div className={classes["util-action"]}>
          <button type="button" onClick={() => handleRemoveProduct(productId)}>
            삭제하기
          </button>
          <button type="button" onClick={() => navigate(`edit`)}>
            수정하기
          </button>
        </div>
      )}

      {/* 상품 상세 정보 컴포넌트 */}
      <DetailComponent product={productData} />
      {/* 구매 및 가격 컴포넌트 */}
      <PriceAndBtnComponent product={productData} />
    </div>
  );
};

export default ProductDetail;
