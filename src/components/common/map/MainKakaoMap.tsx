import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Map,
  MapMarker,
  ZoomControl,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";

import CustomOverlayBox from "./CustomOverlayBox";
import { useThemeSlice, useSearchSlice } from "../../../store";
import { BASE_URL } from "../../../services/BaseUrl";
import MediaQueryMain from "../../UI/MediaQueryMain";

import classes from "./MainKakaoMap.module.css";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import { Box } from "@mui/material";

import USER_MARKER from "../../../assets/images/user-marker2-image.png";
import PARKING_MARKER from "../../../assets/images/parking-marker-image.png";
import NOIMAGE from "../../../assets/images/car-image.png";

// 홈페이지 메인 지도 서비스
type Props = {
  map: kakao.maps.Map | undefined;
  setMap: (m: kakao.maps.Map | undefined) => void;
  setProducts: (list: ProductListType) => void;
  searchInfo: MapInfoType;
  nowLocation: LocationType;
  handleFetchNowLocation: () => void;
};

// Home에서 내려준 props검색시 사용된 주소 받기
const MainKakaoMap = ({
  map,
  setMap,
  setProducts,
  searchInfo,
  nowLocation,
  handleFetchNowLocation,
}: Props) => {
  const isMobile = MediaQueryMain();
  const { searchItemsInThisBoundAndPeriod: searchItemsInThisBound } = useSearchSlice();

  const [mapExist, setMapExist] = useState<boolean>(false);
  const [markers, setMarkers] = useState<ProductListType | []>();
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean | undefined>(false);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [_, setIsBtnClick] = useState<boolean>(false);

  const { setIsToastOpen, setAlertText } = useThemeSlice();

  
  const searchProducts = useCallback(async () => {
    if (!map) return;

    const bound = map.getBounds();
    const res = await searchItemsInThisBound(bound, searchInfo.period);

    setMarkers(res); // 마커변경출력
    setProducts(res); // 리스트변경출력
  }, [map, searchInfo.period, setProducts]);

  useEffect(() => {
    if (mapExist) {
      searchProducts();
    }
  }, [
    mapExist,
    searchProducts,
    searchInfo.place_name,
    searchInfo.centerLatLng?.lat, 
    searchInfo.centerLatLng?.lng,
  ]);

  // 현위치 버튼 클릭시
  const handleToggleLocation = () => {
    setIsBtnClick(true);
    // 로딩중 토스트 ui설정
    setIsToastOpen(true);
    setAlertText("현재위치를 불러오고 있습니다. 잠시만 기다려주세요!");
    handleFetchNowLocation();
  };

  // 지도 초기 중심좌표 메모이제이션
  // 렌더링 시마다 객체가 새로 생성되어 지도가 깜빡이거나 중심을 다시 잡는 현상 방지
  const initialCenter = useMemo(
    () => ({
      lat: 37.5070100333146,
      lng: 127.055618149788,
    }),
    []
  );

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: isMobile ? "500px" : "auto",
      }}
    >
      {/* 현재위치버튼을 클릭하지 않았을경우와 클릭했을경우 Map의 center좌표 다르게 */}
      <Map
        center={initialCenter} // 수정된 부분: 메모이즈된 객체 사용
        style={{ height: "100vh" }}
        level={4} // 초기 지도의 레벨 값
        onCreate={(map) => {
          setMap(map); // 생성
          setMapExist(true);
        }}
        onZoomChanged={() => {
          searchProducts();
        }}
        onDragEnd={() => {
          searchProducts();
          setSelectedMarker(null); // 지도 움직일시 클릭한 오버레이 초기화
        }}
        maxLevel={7}
      >
        {/* 검색한 위치 마커 보여주기 */}
        {searchInfo.place_name && (
          <MapMarker
            position={{
              lat: Number(searchInfo.centerLatLng.lat),
              lng: Number(searchInfo.centerLatLng.lng),
            }}
          >
            <div
              style={{
                padding: "5px 0 10px 18px",
                color: "#000",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontWeight: "700",
                  color: "var(--color-primary-800)",
                  fontSize: "14px",
                }}
              >
                {searchInfo.place_name}
              </p>
            </div>
          </MapMarker>
        )}

        {/* 상품들 데이터리스트를 맵핑해서 해당 위치값을 마커로 보여주기 */}
        {markers &&
          markers?.map((el, idx) => (
            <div key={idx}>
              <MapMarker
                position={{
                  lat: Number(el?.extra?.lat),
                  lng: Number(el?.extra?.lng),
                }}
                onClick={() => {
                  setIsOverlayOpen(true);
                  setSelectedMarker(idx);
                }}
                image={{
                  src: PARKING_MARKER,
                  size: { width: 60, height: 60 },
                }}
              />
              {isOverlayOpen && selectedMarker === idx && (
                <CustomOverlayMap
                  position={{
                    lat: Number(el?.extra?.lat),
                    lng: Number(el?.extra?.lng),
                  }}
                  clickable={true}
                >
                  <CustomOverlayBox
                    setIsOverlayOpen={setIsOverlayOpen}
                    setSelectedMarker={setSelectedMarker}
                    title={el?.name}
                    startDate={el.extra?.startDate}
                    endDate={el.extra?.endDate}
                    linkId={el?._id}
                    mainImage={
                      el.mainImages?.length !== 0
                        ? BASE_URL + el.mainImages[0].url
                        : NOIMAGE
                    }
                  />
                </CustomOverlayMap>
              )}
            </div>
          ))}

        {/* 현재 위치 마커 */}
        {!nowLocation.isLoading && (
          <MapMarker
            position={{
              lat: Number(nowLocation.centerLatLng.lat),
              lng: Number(nowLocation.centerLatLng.lng),
            }}
            image={{
              src: USER_MARKER,
              size: { width: 60, height: 60 },
            }}
          ></MapMarker>
        )}
        <ZoomControl />
      </Map>

      <div className={classes["map-control"]}>
        <MyLocationIcon
          sx={{
            cursor: "pointer",
            backgroundColor: "var(--color-sub-500)",
            color: "var(--color-white)",
            padding: "6px",
            fontSize: "40px",
            boxShadow: "1px 2px 2px rgba(0, 0, 0, 0.3)",
            borderRadius: "10px",
          }}
          className={classes["location-btn"]}
          onClick={handleToggleLocation}
        />
      </div>
    </Box>
  );
};

export default MainKakaoMap;