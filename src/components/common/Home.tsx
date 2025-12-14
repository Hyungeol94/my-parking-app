/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useRef } from "react";

import ProductList from "../domain/product/list/ProductList";
import MainKakaoMap from "./map/MainKakaoMap";

import Footer from "../layouts/Footer";
import { Box } from "@mui/system";
import SlideBar from "../layouts/SlideBar";
import SearchInput from "../layouts/SearchInput";
import SearchHeader from "../layouts/SearchHeader";
import MediaQueryMain from "../UI/MediaQueryMain";
import { useTheme } from "@mui/material";
import { useBoundStore } from "../../store";
import { Toast } from "../UI/Toast";

const Home = () => {
  const isToastOpen = useBoundStore((state) => state.isToastOpen);

  const alertText = useBoundStore((state) => state.alertText);
  const bgColor = useBoundStore((state) => state.bgColor);

  const isMobile = MediaQueryMain();
  const theme = useTheme();
  const searchRef = useRef<HTMLInputElement>(null); // 검색 인풋

  const [map, setMap] = useState<kakao.maps.Map>();
  const [products, setProducts] = useState<ProductListType | []>([]); // 서버 요청 받는 상품들 데이터(초기, 검색후)
  const [nowLocation, setNowLocation] = useState<LocationType>({
    centerLatLng: {
      lat: undefined,
      lng: undefined,
    },
    error: null,
    isLoading: true,
  }); // 현재위치 상태
  const [period, setPeriod] = useState<string[]>(["2023-12-01", "2024-01-31"]);
  const [searchInfo, setSearchInfo] = useState<MapInfoType>({
    place_name: null,
    centerLatLng: {
      // 현재 위치로 초기 좌표 설정 현재 좌표 못불러오면 애플트리타워로 초기 좌표설정
      lat: null,
      lng: null,
    },
    period: undefined,
    isPanTo: false,
  }); // 지도 정보 상태

  //상품 검색에 필요한 정보(searchInfo)를 변경하고, 사용자의 검색 의도에 따라 조건적으로 지도를 움직이는 함수
  const handleSearch = () => {
    if (!map || !searchRef.current) return;

    // 검색어 입력값이 없는 경우, 날짜 필터만 적용해서 상품 검색
    if (searchRef.current.value === "") {
      setSearchInfo({
        ...searchInfo,
        period: period,
        place_name: null,
      });
      return;
    }

    //검색어 입력값이 있는 경우, 지도를 이동한 후 상품 검색
    const ps = new kakao.maps.services.Places(map);
    ps.keywordSearch(`${searchRef.current.value}`, placeSearchCB);

    function placeSearchCB(
      result: kakao.maps.services.PlacesSearchResult,
      status: kakao.maps.services.Status
    ) {
      if (!map) return;
      if (status === kakao.maps.services.Status.OK) {
        const data = result[0]; // 가장 유사한 상위검색객체 저장
        //지도의 중심 좌표 이동
        map.setCenter(new kakao.maps.LatLng(Number(data.y), Number(data.x)));

        //지정한 영역이 가장 잘 보이는 최적의 지도 중심 좌표와 레벨이 지정
        // const bound = new kakao.maps.LatLngBounds(); // 지도 영역생성 -> 사각형
        // bound.extend(new kakao.maps.LatLng(Number(data.y), Number(data.x)));
        // map.setBounds(bound);

        // (추가)검색한 키워드, 중심좌표, 영역을 담은 객체 상태를 변경해줍니다.
        setSearchInfo({
          ...searchInfo,
          place_name: data.place_name,
          period: period,
          centerLatLng: {
            lat: Number(data.y),
            lng: Number(data.x),
          },
        });
      }
    }
  };

  // 현재 위치 불러오는 함수 -> 한번 불러온 위치 캐시메모리에 저장(useCallback)
  const handleFetchNowLocation = async () => {
    if (!map) return;
    if (navigator.geolocation) {
      // geo서비스를 사용해서 접속 위치 추출
      await navigator.geolocation.getCurrentPosition(
        (position) => {
          setNowLocation((prev) => ({
            ...prev,
            centerLatLng: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isLoading: false,
          }));

          map.setCenter(
            new kakao.maps.LatLng(
              Number(position.coords.latitude),
              Number(position.coords.longitude)
            )
          );
          setSearchInfo((prev) => ({
            ...prev,
            place_name: null,
            centerLatLng: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
            isPanTo: true,
          }));
        },
        (err) => {
          setNowLocation((prev) => ({
            ...prev,
            errror: err.message,
            isLoading: false,
          }));
        }
      );
    } else {
      // geo서비스를 사용못할때 마커표시와 인포윈도우 내용 설정
      setNowLocation((prev) => ({
        ...prev,
        error: "실시간 위치정보를 불러오는데 문제가 생겼습니다.",
        isLoading: false,
      }));
    }
  };

  //searchInput이 받는 props 를 여기에 정의해주세요
  const searchInputElement = (
    <SearchInput
      ref={searchRef}
      handleSearch={handleSearch}
      searchInfo={searchInfo}
      setPeriod={setPeriod}
    />
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        width: "100%",
        position: "absolute",
        top: "0",
        left: "0",
      }}
    >
      {/* 왼쪽 사이드바 */}
      {isMobile ? (
        <SearchHeader children={searchInputElement} />
      ) : (
        <Box
          sx={{
            flex: "0.5",
            backgroundColor: theme.palette.background.default,
            position: "relative",
          }}
          minWidth="360px"
        >
          <SlideBar children={searchInputElement} />
        </Box>
      )}

      {/* 가운데 지도  */}

      <Box
        sx={{
          flex: "2",
          width: "100%",
          margin: isMobile ? "0 auto" : "0",
          paddingTop: isMobile ? "77px" : "0",
        }}
      >
        <MainKakaoMap
          map={map}
          setMap={setMap}
          setProducts={setProducts}
          searchInfo={searchInfo}
          nowLocation={nowLocation}
          handleFetchNowLocation={handleFetchNowLocation}
        />
      </Box>

      {/* 오른쪽사이드바 */}
      <Box
        sx={{
          flex: "0.5",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <ProductList products={products} isMobile={isMobile} />
      </Box>

      {isMobile && <Footer />}

      <Toast
        isToastOpen={isToastOpen}
        alertText={alertText}
        bgColor={bgColor}
      />
    </Box>
  );
};

export default Home;

// 검색한 주소의 위치를 받아서 1. 지도가 이동하고 2. 받은 위치와 서버에 담긴 상품들을 불러와소 해당 상품들 위치정보와 같은 범위의 상품들을 마커배열에 등록해서 렌더링해준다.

// 1. 왼쪽 사이드바에서 검색어를 입력하면 지도에 표시되게 하려면 사이드바 컴포넌트에 props로 검색어 상태변경함수를 내려주어야함
// 2. 검색된 위치에 해당하는 상품 데이터를 MainKakaoMap에 보여줘야하고, 해당하는 리스트를 불러오는건 오른족 사이드바 컴포넌트에서 진행해야함
// 3. 지도 레벨에따라 해당하는 범위의 게시글을 랜더링해주기(정보업데이트)
// 우선 기본 좌표는 고정값 그대로 해두고(searchInfo의 중심좌표) 현위치 버튼을 눌렀을 시에만 지도 이동을 시키게만 하는편잉 좋을거같아요
