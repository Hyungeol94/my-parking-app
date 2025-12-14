import axios from "axios";
import mem from "mem";
import { BASE_URL } from "./BaseUrl";
import { useAuthSlice } from "../store";
import { useNavigate } from "react-router-dom";

// 리플래쉬 토큰 앤드포인트 경로
const REFRESH_URL = "/users/refresh"; // 리프래쉬 토큰을 서버에 보내는 주소 -> 서버에서 새로운 엑세스 토큰 보내줌

const useCustomAxios = () => {
const { userBasicInfo: user, userToken, logout, updateUserBasicInfo: setUser } = useAuthSlice();
const { accessToken: userAccToken, refreshToken: userRefToken } = userToken || {};

  const navigate = useNavigate();

  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 1000 * 5, // 요청이 timeout보다 오래걸리면 요청 중단됨
    headers: {
      "Content-Type": "application/json",
      accept: "application/json", // 서버로부터 받고자하는 응답 미디어 타입 지정 -> JSON
    },
    withCredentials: true, // 쿠키, Authorization 인증 헤더, TLS client certifacates를 내포하는 자격 증명을 자동으로 포함시켜 서버전송 가능하도록 설정
  });

  // 요청 인터셉트 -> 요청이 전달되기 전에 작업(전처리) 수행, 요청 오류가 있는 작업 수행을 할 수 있는 2개의 콜백 함수를 받음
  // 첫번째 인자에 들어간 콜백함수가 받는 매개변수(config) :요청시 헤더에 담은 설정객체
  instance.interceptors.request.use(
    (config) => {
      // 요청 전 토큰이 유효한지 리프래쉬토큰 검증 절차 진행
      // console.log(config.url);
      let token = userAccToken;
      if (config.url === REFRESH_URL) {
        // 요청을 보내는 객체 안에 리프래쉬토큰을 전달할 api주소가 있다면, 기존 받아온 리프래쉬 토큰 저장
        token = userRefToken;
      }
      config.headers["Authorization"] = `Bearer ${token}`;
      return config;
    },
    (error) => {
      console.error("interceptors error", error);
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 -> 응답 데이터가 있는 작업(후처리) 수행, 응답 오류가 있는 작업 수행을 할 수 있는 2개의 콜백 함수를 받음
  // 첫번째 인자에 들어간 콜백함수가 받는 매개변수(response) : 서버로부터 온 응답데이터 객체
  instance.interceptors.response.use(
    (response) => {
      // console.log(response);
      return response;
    },
    async (error) => {
      console.error("interceptors error", error);

      const { config, response } = error;

      if (response?.status === 401) {
        // 응답 에러 메시지가 TokenExpiredError이거나 요청에 리프래쉬토큰 보내는 주소api가 아니면 재발급을 진행합니다.
        if (
          response.data.errorName === "TokenExpiredError" &&
          config.url !== REFRESH_URL
        ) {
          console.log("accessToken 만료. 재발급이 필요합니다.");
          const accessToken = await getAccessToken(instance);

          if (accessToken) {
            // 새롭게 전달받은 엑세스토큰을 에러에서 나온 config 헤더 오더라이제이션에 다시 담아줍니다.
            config.headers.Authorization = `Bearer ${accessToken}`;

            // 주스탄드user 상태값도 업데이트 해줍니다.
            setUser(
              {
                accessToken: accessToken,
                refreshToken: userRefToken,
              },
              user
            );
            // 기존 axios 설정값을 가지고 재요청
            return axios(error.config);
          }
        } else {
          // 리플래쉬 토큰마저 만료될경우에
          alert("다시 로그인이 필요합니다.");
          logout();
          navigate("/login");
        }
      } else if (response?.status === 404) {
        // 404오류뜨면 에러페이지로 이동시키기
        navigate("/error");
      } else {
        const error = response?.data?.error;
        // Network error 같은 경우 response가 없거나 서버에서 error를 응답한 경우
        if (!response || error) {
          alert(
            error?.message ||
              `요청하신 작업처리에 실패했습니다. 잠시후 다시 요청하시기 바랍니다.`
          );
        } else {
          return Promise.reject(error);
        }
      }
    }
  );

  // AccessToken 재발급
  const getAccessToken = mem(
    async function (instance) {
      try {
        const {
          data: { accessToken },
        } = await instance.get(REFRESH_URL);

        return accessToken;
      } catch (error) {
        console.error(error);
        alert("다시 로그인이 필요합니다.");
      }
    },
    { maxAge: 1000 }
  );

  return instance;
};

export default useCustomAxios;
