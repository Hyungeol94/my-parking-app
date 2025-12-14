import { Box } from "@mui/system";
import CheckIcon from "@mui/icons-material/Check";
import { CommonButtonMiddle } from "../../UI/CommonButton";
import { useNavigate } from "react-router-dom";
import classes from "./PurchaseResult.module.css";
import { useEffect } from "react";
import { Toast } from "../../UI/Toast";
import { useThemeSlice } from "../../../store";

const PurchaseResult = () => {
  const navigate = useNavigate();
  const { isToastOpen, alertText, bgColor } = useThemeSlice()
  
  useEffect(() => {
    const handleBeforeUnload = () => {
      //결제완료 페이지에서 뒤로가기 눌렀을 때 home 으로 이동
      navigate("/home");
    };
    window.addEventListener("popstate", handleBeforeUnload);
  }, [navigate]);

  return (
    <Box
      className={classes.purchaseResultContainer}
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 400,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <CheckIcon
          sx={{
            fontSize: "200px",
            color: "#54BE0C",
          }}
        />
        <p>결제가 완료되었습니다.</p>
        <Box
          sx={{
            mb: "20px",
            width: "300px",
          }}
        >
          <CommonButtonMiddle
            text="예약 확인하기"
            onClick={() => navigate("/order-history")}
          />
        </Box>
        <Box
          sx={{
            width: "300px",
          }}
        >
          <CommonButtonMiddle text="홈으로" onClick={() => navigate("/home")} />
        </Box>
      </Box>
      <Toast
        isToastOpen={isToastOpen}
        alertText={alertText}
        bgColor={bgColor}
      />
    </Box>
  );
};

export default PurchaseResult;
