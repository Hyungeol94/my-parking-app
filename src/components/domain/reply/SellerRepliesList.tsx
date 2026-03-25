import React, { useEffect, useState } from "react";
import ReviewCard from "./ReviewCard";
import useCustomAxios from "../../../services/useCustomAxios";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../../../services/BaseUrl";
import classes from "./SellerReplies.module.css";
import Loading from "../../common/Loading";

const SellerRepliesList: React.FC = () => {
  const { sellerId } = useParams();
  const [RepliesListData, setRepliesList] = useState([]);
  const axiosInstance = useCustomAxios();
  const [loading, setLoading] = useState(true);

  
  useEffect(function queryReviews() {
    (async () => {
      try {
        const response = await axiosInstance.get(`/replies/seller/${sellerId}`);
        setLoading(false);
        setRepliesList(response.data.item);
      } catch (error) {
        console.error("리뷰 리스트 에러");
      }
    })();
  }, []);


  return (
    <>
      <h2 className={classes.h2}>판매자 후기 목록</h2>
      {loading ? (
        <Loading />
      ) : RepliesListData.length !== 0 ? (
        RepliesListData.map((item: RepliesGetItemType) => {
          return (
            <div key={item._id}>
              <ReviewCard
                src={BASE_URL + item.image.url}
                title={item.name}
                price={item.price}
                // 하나의 상품에 여러 리뷰가 올 수 없기 때문에 첫번쨰 리뷰만 보여집니다
                content={item.replies[0].content}
                ratingValue={item.replies[0].rating}
              />
            </div>
          );
        })
      ) : (
        <p className={classes.text}>등록된 후기가 없습니다.</p>
      )}
    </>
  );
};

export default SellerRepliesList;
