import axios from "axios";
import { StateCreator } from "zustand";
import { BASE_URL } from "../services/BaseUrl";

const requestItemsInThisBoundAndPeriod: (
  bound: kakao.maps.LatLngBounds,
  period?: string[] | undefined,
  options?: {
    signal? : AbortSignal
  }
) => Promise<ProductListType> = async (bound, period?, options?) => {
  const sw: kakao.maps.LatLng = bound.getSouthWest();
  const ne: kakao.maps.LatLng = bound.getNorthEast();

  const [min_lat, min_lng]: number[] = [sw.getLat(), sw.getLng()];
  const [max_lat, max_lng]: number[] = [ne.getLat(), ne.getLng()];
  //Lat의 범위 : sw[0] <= lat <= ne[0]
  //lng의 범위 : sw[1] <= lng <= ne[1]
  
  const query =
    period !== undefined
      ? `${BASE_URL}/products?custom={"extra.lat" : {"$gte": ${min_lat}, "$lte": ${max_lat}}, "extra.lng" : {"$gte": ${min_lng}, "$lte": ${max_lng}}, "extra.startDate" : {"$gte": "${period[0]}"}, "extra.endDate" : {"$lte": "${period[1]}"}}`
      : `${BASE_URL}/products?custom={"extra.lat" : {"$gte": ${min_lat}, "$lte": ${max_lat}}, "extra.lng" : {"$gte": ${min_lng}, "$lte": ${max_lng}}}`;

  try {
    const response = await axios.get<string, { data: ProductListResType }>(
      query, options
    );
    if (response.data.ok === 1) {
      return response.data.item;
    }
  } catch (error: unknown) {
    if (axios.isCancel(error)) {
        throw error;
    }
    if (axios.isAxiosError(error)){
      if (error.response) {
        alert(error.response.data.message);
        console.log("error");
      }
  }
    console.error("Error:", error);
  }
  return [] as ProductListType;
};

export const createSearchSlice: StateCreator<SearchSlice, []> = () => ({
  searchItemsInThisBound: (bound) => {
    return requestItemsInThisBoundAndPeriod(bound);
  },
  searchItemsInThisBoundAndPeriod: (bound, period?, options?) => {
    return requestItemsInThisBoundAndPeriod(bound, period, options);
  },
});
