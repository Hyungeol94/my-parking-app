import { ChangeEvent, ChangeEventHandler, useState } from "react";
import { UserInputClass } from "../../../types/classImplementations";
import { useAuthSlice, useThemeSlice } from "../../../store/index";
import { useNavigate } from "react-router-dom";
import SignUpForm from "./SignUpForm";

const SignUp = () => {
  const AuthSlice: AuthSlice = useAuthSlice();
  const ThemeSlice: ThemeSlice = useThemeSlice();
  const isToastOpen = ThemeSlice.isToastOpen
  const setIsToastOpen= ThemeSlice.setIsToastOpen
  const bgColor = ThemeSlice.bgColor
  const setBgColor = ThemeSlice.setBgColor
  const toastMessage = ThemeSlice.alertText
  const setToastMessage = ThemeSlice.setAlertText
  const navigate = useNavigate();
  const [userInputs, setUserInputs] = useState<UserInputClass>(
    new UserInputClass()
  );

  const saveUserInputs: ChangeEventHandler<HTMLInputElement> = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = event.target as HTMLInputElement;

    setUserInputs((prev: UserInputClass) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isMatching: () => boolean = () => {
    if (userInputs.password === userInputs.passwordCheck) return true;
    return false;
  };

  const handleSignUp: (userInputs: UserInputClass) => void = async (
    userInputs: UserInputClass
  ) => {
    //userInputs에서 passwordCheck를 삭제한 객체 newPerson을 만들어 줍니다.
    const newPerson: Partial<UserInputClass> = { ...userInputs };
    delete newPerson["passwordCheck"];

    const AuthAlert = await AuthSlice.signUp(newPerson);
    //newPerson을 넣어 회원가입을 진행합니다. 잘 완료되었다면 login 페이지로 이동합니다.
    if (AuthAlert["ok"] == true) {
      setIsToastOpen(true);
      setToastMessage(AuthAlert["message"]);
      setBgColor("var(--toast-success)");
      navigate("/login");
    } else {
      setIsToastOpen(true);
      setToastMessage(AuthAlert["message"]);
      setBgColor("var(--toast-error)");
    }
  };

  const handleEmailVerification: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void = async (_: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const AuthAlert = await AuthSlice.verifyEmail(userInputs.email);
    if (AuthAlert["ok"] == true) {
      setIsToastOpen(true);
      setToastMessage(AuthAlert["message"]);
      setBgColor("var(--toast-success)");
    } else {
      setIsToastOpen(true);
      setToastMessage(AuthAlert["message"]);
      setBgColor("var(--toast-error)");
    }
  };

  const checkPassword = () => {
    const pw = userInputs.password;
    const regexPw = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^\w\d\s]).{8,}$/;
    if (!regexPw.test(pw)) {
      return false;
    }
    return true;
  };

  const titleDict = {
    email: "이메일",
    password: "비밀번호",
    password_check: "비밀번호 확인",
    name: "이름",
    phone: "전화번호",
    address: "주소",
  };

  return(
    <SignUpForm 
      userInputs= {userInputs}
      saveUserInputs = {saveUserInputs}
      isMatching = {isMatching}
      handleSignUp = {handleSignUp}
      checkPassword = {checkPassword}
      handleEmailVerification = {handleEmailVerification}
      titleDict = {titleDict}
      bgColor={bgColor}
      alertText={toastMessage}
      isToastOpen={isToastOpen}
    />
  );
};

export default SignUp;
