import { Navigate, Outlet } from "react-router-dom";
import { useAuthSlice } from "../../store";

interface Props {
  isNeedLoggedIn: boolean;
}

const PrivateRoute = ({ isNeedLoggedIn }: Props) => {
  const { isLoggedIn: isLogin } = useAuthSlice()

  // 로그인 필요한데 로그인이 되었다면(판매자 구매자 상관X 토큰O) => 로그인 해야 접근가능한 페이지들과 로그인 필요없고 로그인도 안되어있을때 => 로그인 하지 않아도 접근 가능한 페이지들
  if ((isNeedLoggedIn && isLogin) || (!isNeedLoggedIn && !isLogin)) {
    return <Outlet />;
  }
  // 로그인이 필요한데 로그인이 되지 않았다면
  if (isNeedLoggedIn && !isLogin) {
    // 로그인 하러 가도록
    alert("로그인이 필요한 페이지입니다. 로그인페이지로 이동합니다.");
    return <Navigate to="/login" replace={true} />;
  }

  return <Outlet />;
};

export default PrivateRoute;
