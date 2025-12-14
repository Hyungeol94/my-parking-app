import { Box } from "@mui/system";
import React from "react";
import { useAuthSlice } from "../../../store";
import classes from "./purchase.module.css";

const PurchaseInformation: React.FC = () => {
  const { userBasicInfo } = useAuthSlice();

  function maskSensitiveInfo(userInfo: {
    name: string;
    phone: string;
    email: string;
  }) {
    // 이름은 그대로 표시, 연락처 뒷부분 4글자, 이메일 뒷부분 @ 이전은 그대로 표시, @ 이후는 마스킹
    const maskedInfo = {
      name: userInfo.name,
      phone: userInfo.phone.replace(/.(?=.{4,}$)/g, "*"), // 뒷부분 4글자를 *로 대체
      email: userInfo.email.replace(/.(?=@)/g, "***"), // @ 이전의 문자를 그대로 표시, @ 이후의 문자를 *로 대체
    };

    return maskedInfo;
  }

  const maskedUserInfo = maskSensitiveInfo(userBasicInfo);

  return (
    <div className={classes.purchaseInformationContainer}>
      <Box
        sx={{
          borderBottom: "1px solid var(--color-gray-300)",
        }}
      >
        <h2>구매자 정보</h2>
      </Box>
      <Box
        sx={{
          borderBottom: "1px solid var(--color-gray-300)",
        }}
      >
        <p>이름: {maskedUserInfo.name}</p>
        <p>연락처: {maskedUserInfo.phone}</p>
        <p>이메일: {maskedUserInfo.email}</p>
      </Box>
    </div>
  );
};

export default PurchaseInformation;
