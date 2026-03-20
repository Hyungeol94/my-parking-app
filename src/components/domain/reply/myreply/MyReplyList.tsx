import React, { useEffect, useState } from "react";
import useCustomAxios from "../../../../services/useCustomAxios";
import ReviewCard from "../ReviewCard";
import { BASE_URL } from "../../../../services/BaseUrl";
import classes from "./MyPeplyList.module.css";
import Loading from "../../../common/Loading";

const MyReplyList: React.FC = () => {
  const axiosInstance = useCustomAxios();
  const [myReplies, setMyReplies] = useState<MyRepliesItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(function queryReviews () {
    const getReplies = async () => {
      const response = await axiosInstance<MyReplies>("/replies");
      setLoading(false);
      return setMyReplies(response.data.item);
    };
    getReplies();
  }, []);

  return (
    <>
      <h2 className={classes.h2}>내 후기 목록</h2>
      {loading ? (
        <Loading />
      ) : myReplies.length !== 0 ? (
        myReplies.map((item) => {
          return (
            <ReviewCard
              title={item.content}
              src={BASE_URL + item.product.image?.url}
              ratingValue={item.rating}
            />
          );
        })
      ) : (
        <p className={classes.text}>후기 목록이 없습니다</p>
      )}
    </>
  );
};

export default MyReplyList;
