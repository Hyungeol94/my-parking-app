import {ChangeEventHandler,PropsWithChildren, } from "react";
import { UserInputClass } from "../../../types/classImplementations";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import { Box } from "@mui/system";
import classes from "./SignUpForm.module.css";
import { CommonButtonLarge, MuiButton } from "../../UI/CommonButton";
import { Toast } from "../../UI/Toast";
import { useNavigate } from "react-router-dom";


interface FormProps extends PropsWithChildren {
  userInputs : UserInputClass
  saveUserInputs : ChangeEventHandler<HTMLInputElement>,
  isMatching : () => boolean,
  handleSignUp : (userInputs: UserInputClass) => void,
  checkPassword : () => boolean,
  handleEmailVerification : (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void
  titleDict : {
    email: string;
    password: string;
    password_check: string;
    name: string;
    phone: string;
    address: string;
  }
  bgColor : string,
  alertText : string,
  isToastOpen : boolean,
}

const SignUpForm: React.FC<PropsWithChildren<FormProps>> = ({
  userInputs,
  saveUserInputs,
  isMatching,
  handleSignUp,
  checkPassword,
  handleEmailVerification,
  titleDict,
  bgColor,
  alertText,
  isToastOpen,
}) => {
  const navigate = useNavigate()
  return (
    <>
      <div className={classes.signUpContainer}>
        <h2>회원가입</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <Box>
            <div>
              <div>회원유형</div>
              <TextField
                select
                fullWidth
                required
                defaultValue="user"
                helperText="회원유형을 선택해 주세요"
                name="type"
                variant="standard"
                onChange={saveUserInputs}
              >
                <MenuItem key="user" value="user">
                  일반
                </MenuItem>
                <MenuItem key="seller" value="seller">
                  판매자
                </MenuItem>
              </TextField>
            </div>
            <div>
              <div>이메일</div>
              <TextField
                fullWidth
                required
                variant="standard"
                name="email"
                onChange={saveUserInputs}
              />
            </div>
            <MuiButton
              onClick={handleEmailVerification}
              // sx={{
              //   color: theme.palette.text.primary,
              // }}
              text={"이메일 중복확인"}
            />
            <div>
              <div>비밀번호</div>
              <TextField
                required
                fullWidth
                value={userInputs.password as string}
                name="password"
                type="password"
                variant="standard"
                onChange={saveUserInputs}
                error={
                  userInputs.password.length === 0
                    ? false
                    : checkPassword()
                    ? false
                    : true
                }
                helperText={
                  userInputs.password.length === 0
                    ? "비밀번호를 설정해 주세요"
                    : checkPassword()
                    ? true
                    : "8~20자 영문 대소문자, 숫자, 특수문자를 사용하세요."
                }
              />
            </div>
            <div>
              <div>비밀번호 확인</div>
              <TextField
                required
                fullWidth
                error={
                  userInputs.password.length === 0
                    ? userInputs.passwordCheck.length !== 0
                      ? true
                      : false
                    : isMatching()
                    ? false
                    : true
                }
                helperText={
                  userInputs.password.length === 0
                    ? userInputs.passwordCheck.length !== 0
                      ? "비밀번호를 설정해 주세요"
                      : true
                    : checkPassword()
                    ? userInputs.passwordCheck.length === 0
                      ? "비밀번호를 다시 입력해 주세요"
                      : isMatching()
                      ? "비밀번호가 일치합니다"
                      : "비밀번호가 일치하지 않습니다"
                    : "비밀번호는 양식에 맞아야 합니다"
                }
                value={userInputs.passwordCheck as string}
                name="passwordCheck"
                type="password"
                variant="standard"
                onChange={saveUserInputs}
              />
            </div>
            {Object.keys(userInputs)
              .filter(
                (v) =>
                  v !== "email" &&
                  v !== "password" &&
                  v !== "extra" &&
                  v !== "type" &&
                  v !== "passwordCheck"
              )
              .map((item) => {
                return (
                  <div key={item}>
                    <div>{titleDict[item as keyof typeof titleDict]}</div>
                    <TextField
                      fullWidth
                      required
                      value={userInputs[item as keyof UserInputClass] as string}
                      name={item}
                      variant="standard"
                      onChange={saveUserInputs}
                    />
                  </div>
                );
              })}
            <Box
              sx={{
                mt: "20px",
              }}
            >
              <CommonButtonLarge
                text="회원가입"
                onClick={() => handleSignUp(userInputs)}
              />
              <MuiButton
                text="회원이십니까? 로그인하러 가기"
                onClick={() => navigate("/login")}
              />
            </Box>
          </Box>
        </form>
      </div>
      <Toast
        bgColor={bgColor}
        alertText={alertText}
        isToastOpen={isToastOpen}
      />
    </>
  );
};

export default SignUpForm;
