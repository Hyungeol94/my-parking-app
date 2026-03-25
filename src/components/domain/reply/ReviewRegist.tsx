import React, { FormEvent, SyntheticEvent, useEffect, useState } from "react";
import { useShallow } from 'zustand/react/shallow';
import useCustomAxios from "../../../services/useCustomAxios";
import ReviewRegistForm from "./ReviewRegistForm";
import { useNavigate, useParams } from "react-router-dom";
import classes from "./ReviewRegist.module.css";
import { Toast } from "../../UI/Toast";
import { useThemeSlice } from "../../../store";

const ReviewRegist: React.FC = () => {
  const navigate = useNavigate();
  //orderHistoryDetailList에서 받아온 ID
  const { productId, orderId } = useParams();
  const axiosInstance = useCustomAxios();
  // 후기입력하는 input 창 값
  const [repliesInput, setRepliesInput] = useState<string>("");
  // 평점 1~5 까지의 값
  const [rating, setRating] = useState<number>(0);

  const { isToastOpen, setIsToastOpen, alertText, setAlertText, bgColor, setBgColor } = useThemeSlice(
    useShallow((state) => ({ 
      isToastOpen: state.isToastOpen, 
      setIsToastOpen: state.setIsToastOpen, 
      alertText: state.alertText, 
      setAlertText: state.setAlertText, 
      bgColor: state.bgColor, 
      setBgColor: state.setBgColor 
    }))
  );

  useEffect(function queryDetails () {
    //product id를 받아 상품 상세 조회 data 가져오기
    (async () => {
      await axiosInstance.get(`/products/${productId}`);
    })();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      setIsToastOpen(true);
      setAlertText("별점을 입력해주세요");
      setBgColor("var(--toast-error)");
    } else {
      //Post 할 때 필수 값지정
      const body: RepliesPostType = {
        order_id: Number(orderId),
        product_id: Number(productId),
        rating: rating,
        content: repliesInput,
      };

      const response = await axiosInstance.post("/replies", body);
      if (response.data.ok === 1) {
        navigate("/reply/replies");
      }
    }
  };

  const handleDrag = (e: SyntheticEvent) => {
    const targetElement = e.target as HTMLInputElement;
    const rating = Number(targetElement.value);
    setRating(rating);
  };

  return (
    <div className={classes.reviewRegistContainer}>
      <ReviewRegistForm
        value={repliesInput}
        onChange={(e) => setRepliesInput(e.target.value)}
        onSubmit={handleSubmit}
        handleDrag={handleDrag}
        ratingValue={rating}
      />
      <Toast
        isToastOpen={isToastOpen}
        alertText={alertText}
        bgColor={bgColor}
      />
    </div>
  );
};
export default ReviewRegist;
