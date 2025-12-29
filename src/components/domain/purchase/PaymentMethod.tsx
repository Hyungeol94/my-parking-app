import { useNavigate } from "react-router-dom";
import { useShallow } from 'zustand/react/shallow';
import { CommonButtonSmall } from "../../UI/CommonButton";
import { useAuthSlice, usePurchaseSlice, useThemeSlice } from "../../../store";
import useCustomAxios from "../../../services/useCustomAxios";

declare global {
  interface Window {
    IMP: {
      init: (s: string) => void;
      request_pay: (
        data: PaymentData,
        callback: (res: PaymentResDataType) => void
      ) => void;
    };
  }
}

interface PaymentMethodProps {
  disabled: boolean;
  paymentOption: string;
}

const PaymentMethod = ({ disabled, paymentOption }: PaymentMethodProps) => {
  const navigate = useNavigate();
  const axiosInstance = useCustomAxios();
  const { userBasicInfo } =  useAuthSlice();
  const { productDetailData } = usePurchaseSlice();
  const { setIsToastOpen, setAlertText, setBgColor } = useThemeSlice(
    useShallow((state) => ({ 
      setIsToastOpen: state.setIsToastOpen, 
      setAlertText: state.setAlertText, 
      setBgColor: state.setBgColor 
    }))
  );
  
  console.log(productDetailData);

  function onClickPayment() {
    /* 1. 가맹점 식별하기 */
    const { IMP } = window;
    IMP.init("imp14397622");

    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: "html5_inicis", // PG사
      pay_method: paymentOption, // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: productDetailData.price, // 결제금액
      // amount: 100, // 결제금액
      name: productDetailData.name, // 주문상품명
      buyer_name: userBasicInfo.name, // 구매자 이름
      buyer_tel: userBasicInfo.phone, // 구매자 전화번호
      buyer_email: userBasicInfo.email, // 구매자 이메일
      buyer_addr: userBasicInfo.address, // 구매자 주소
    };

    /* 4. 결제 창 호출하기 */
    IMP.request_pay(data, purchaseResult);
  }

  /* 3. 콜백 함수 정의하기 */
  function purchaseResult(response: PaymentResDataType) {
    const { success, error_msg } = response;
    // console.log(response);
    if (success) {
      setIsToastOpen(true);
      setAlertText("결제 성공");
      setBgColor("var(--toast-success)");
      // 실제 결제 성공 후 db에 결제 정보 저장이 됩니다.
      // 오늘 날짜 받아오는 함수
      const nowDate = () => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const day = new Date().getDate();
        return `${year}.${month}.${day}`;
      };

      const postData = async () => {
        const body = {
          products: [
            {
              _id: productDetailData._id,
              quantity: productDetailData.quantity,
            },
          ],
          address: {
            name: userBasicInfo.address,
            value: productDetailData.name,
          },
          extra: {
            buyDate: nowDate(),
          },
        };

        try {
          await axiosInstance.post("/orders", body);
          navigate("/purchase/result");
        } catch (error) {
          console.error("결제 에러");
        }
      };
      postData();
      navigate("/purchase/result");
    } else {
      setIsToastOpen(true);
      setAlertText(`결제 실패: ${error_msg}`);
      setBgColor("var(--toast-error)");
    }
  }
  return (
    <CommonButtonSmall
      disabled={disabled}
      text="결제하기"
      onClick={onClickPayment}
    />
  );
};

export default PaymentMethod;
