import { useEffect, useState, useMemo, useCallback } from "react";
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

type Props = {
  map: kakao.maps.Map | undefined;
  setMap: (m: kakao.maps.Map | undefined) => void;
  setProducts: (list: ProductListType) => void;
  searchInfo: MapInfoType;
  nowLocation: LocationType;
  handleFetchNowLocation: () => void;
};

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

  // [안전장치 1] 함수 재생성 방지 (의존성에서 Slice 함수 제외)
  const searchProducts = useCallback(async () => {
    if (!map) return;

    const bound = map.getBounds();
    // searchInfo 객체 전체가 아니라 period만 사용
    const res = await searchItemsInThisBound(bound, searchInfo.period);

    setMarkers(res); 
    setProducts(res); 
  }, [map, searchInfo.period, setProducts]); // searchItemsInThisBound 제거됨 (안전)

  // [안전장치 2] useEffect 무한 루프 방지
  // searchInfo 객체 자체가 아니라 내부 값(primitive)이 변할 때만 실행
  useEffect(() => {
    if (mapExist) {
      searchProducts();
    }
  }, [
    mapExist,
    searchProducts,
    searchInfo.place_name,       // 이름이 바뀌거나
    searchInfo.centerLatLng?.lat, // 위도가 바뀌거나
    searchInfo.centerLatLng?.lng  // 경도가 바뀔 때만 실행
  ]);

  // [안전장치 3] 지도 중심 좌표 메모이제이션
  const initialCenter = useMemo(() => ({
    lat: 37.5070100333146,
    lng: 127.055618149788,
  }), []);

  // [안전장치 4] onCreate 핸들러 메모이제이션 및 방어 코드
  const handleCreate = useCallback((mapInstance: kakao.maps.Map) => {
    // 이미 map이 존재하면 setMap을 호출하지 않음 -> 루프 차단
    if (!map) {
      setMap(mapInstance);
      setMapExist(true);
    }
  }, [map, setMap]);

  const handleToggleLocation = () => {
    setIsBtnClick(true);
    setIsToastOpen(true);
    setAlertText("현재위치를 불러오고 있습니다. 잠시만 기다려주세요!");
    handleFetchNowLocation();
  };

  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: isMobile ? "500px" : "auto",
      }}
    >
      <Map
        center={initialCenter} // 메모이즈된 좌표 사용
        style={{ height: "100vh" }}
        level={4}
        onCreate={handleCreate} // 메모이즈된 핸들러 사용
        onZoomChanged={() => {
          searchProducts();
        }}
        onDragEnd={() => {
          searchProducts();
          setSelectedMarker(null);
        }}
        maxLevel={7}
      >
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
          />
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