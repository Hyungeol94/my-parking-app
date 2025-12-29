// 컴포넌트 안에 비즈니스로직이고 반환(return)은 해당 로직에서 사용한 변수나 함수를 전달할 UI컴포넌트 렌더링
import React, { ChangeEvent, useState } from "react";
import { useShallow } from 'zustand/react/shallow';
import LoginForm from "./LoginForm";
import { useNavigate } from "react-router-dom";
import { useAuthSlice, useThemeSlice } from "../../../store/index";

const Login = () => {
  const navigate = useNavigate();
  const [userInputId, setUserInputId] = useState("");
  const [userInputPassword, setUserInputPassword] = useState("");
  
  const {updateUserBasicInfo, login} = useAuthSlice(
    useShallow((state) => ({ 
      updateUserBasicInfo: state.updateUserBasicInfo, 
      login: state.login 
    }))
  )
  const { isToastOpen, setIsToastOpen, alertText, setAlertText, bgColor, setBgColor } = useThemeSlice(
    useShallow((state) => ({ 
      isToastOpen: state.isToastOpen, 
      setIsToastOpen: state.setIsToastOpen, 
      alertText: state.alertText, 
      setAlertText: state.setAlertText, 
      bgColor: state.bgColor, 
      setBgColor: state.setBgColor 
    }))
  )
  
  // input의 id name에 따라 값이 담김
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === "user-email") {
      setUserInputId(e.target.value);
    } else if (e.target.id === "user-password") {
      setUserInputPassword(e.target.value);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const responseItem = await login(userInputId, userInputPassword);
    const errorMessage = responseItem.message;
    // response 된 data 에 _id 라는 key 가 있다면 로그인 성공으로 간주합니다.
    if ("_id" in responseItem) {
      setIsToastOpen(true);
      setAlertText("로그인이 완료되었습니다");
      setBgColor("var(--toast-success)");
      updateUserBasicInfo(responseItem.token, responseItem);
      navigate("/home");
    } else {
      setIsToastOpen(true);
      setAlertText(errorMessage);
      setBgColor("var(--toast-error)");
    }
  };

  return (
    <div>
      <LoginForm
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        userInputPassword={userInputPassword}
        userInputId={userInputId}
        isToastOpen={isToastOpen}
        alertText={alertText}
        bgColor={bgColor}
      />
    </div>
  );
};

export default Login;
