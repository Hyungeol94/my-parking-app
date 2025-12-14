import { Navigate, Outlet } from "react-router-dom";
import { useAuthSlice } from "../../store";

interface Props {
  userType: string;
}
// 유저 타입과 현재 로그인한 유저정보에서 유저 타입이 각각 seller와 user일때, 각각 해당하는 타입으로 조건이 맞지 않으면 에러메시지와, 알람을 주고 에러 페이지로 Navigate 해준다.(Navigate컴포넌트 시도)
// 조건이 맞다면 Outlet 리턴
const UserTypeRoute = ({ userType }: Props) => {

  const { userBasicInfo: userInfo } = useAuthSlice();

  if (userType === "seller") {
    if (userInfo.type === userType) {
      return <Outlet />;
    } else {
      alert(
        "해당 페이지는 판매자만 접근이 가능합니다. 판매자로 로그인 또는 가입하여 다시 시도해 주세요."
      );
      return <Navigate to="/login" />;
    }
  }

  if (userType == "user") {
    if (userInfo.type === userType) {
      return <Outlet />;
    } else {
      alert(
        "해당 페이지는 구매자만 접근이 가능합니다. 구매자로 로그인 또는 가입하여 다시 시도해 주세요."
      );
    }
    return <Navigate to="/login" />;
  }
};

export default UserTypeRoute;
