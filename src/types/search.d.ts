interface SearchSlice {
  searchItemsInThisBound : (bound: kakao.maps.LatLngBounds) => Promise<ProductListType>
  searchItemsInThisBoundAndPeriod : (bound:kakao.maps.LatLngBounds, period: string[]|undefined, options: {signal? : AbortSignal}) => Promise<ProductListType>
}

