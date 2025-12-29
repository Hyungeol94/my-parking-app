// // zustand store 생성
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { createAuthSlice } from "./authSlice";
import { createMyPageSlice } from "./MyPageSlice";
import { createProductSlice } from "./ProductSlice";
import { createPurchaseSlice } from "./PurchaseSlice";
import { createSearchSlice } from "./searchSlice";
import { themeSlice } from "./themeSlice";
import { createImageSlice } from "./imageSlice";
import { createCustomAxiosSlice } from "./customAxiosSlice";

export const useBoundStore = create<
    AuthSlice &
    MyPageSlice &
    PurchaseSlice &
    ProductSlice &
    SearchSlice &
    ThemeSlice &
    ImageSlice & 
    customAxiosSlice
>()(
  devtools(
    persist(
      (...a) => ({
        ...createAuthSlice(...a),
        ...createMyPageSlice(...a),
        ...createProductSlice(...a),
        ...createPurchaseSlice(...a),
        ...themeSlice(...a),
        ...createSearchSlice(...a),
        ...createImageSlice(...a),
        ...createCustomAxiosSlice(...a),
      }),
      {
        name: "boundStore",
        partialize: (state) => ({
          userToken: state.userToken,
          userBasicInfo: state.userBasicInfo,
          isLoggedIn: state.isLoggedIn,
          productDetailData: state.productDetailData,
          isDark: state.isDark,
          navSelectedValue: state.navSelectedValue,
        }),
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);


type BoundStoreType = AuthSlice & MyPageSlice & PurchaseSlice & ProductSlice & SearchSlice & ThemeSlice & ImageSlice & customAxiosSlice;

export const useAuthSlice = <T = AuthSlice>(
  selector?: (state: BoundStoreType) => T
) => {
  const defaultSelector = (state: BoundStoreType) => ({
    userToken: state.userToken,
    userBasicInfo: state.userBasicInfo,
    isLoggedIn: state.isLoggedIn,
    verifyEmail: state.verifyEmail,
    signUp: state.signUp,
    login: state.login,
    updateUserBasicInfo: state.updateUserBasicInfo,
    logout: state.logout,
  } satisfies AuthSlice);

  return useBoundStore(selector ?? (defaultSelector as any)) as T extends AuthSlice ? AuthSlice : T;
}


export const useMyPageSlice = <T = MyPageSlice>(
  selector?: (state: BoundStoreType) => T
) => {
  const defaultSelector = (state: BoundStoreType) => ({
    myInfo: state.myInfo,
    getMyInfo: state.getMyInfo,
    setMyInfo: state.setMyInfo,
    updateMyInfo: state.updateMyInfo,
    getMyProducts: state.getMyProducts,
  } satisfies MyPageSlice);

  return useBoundStore(selector ?? (defaultSelector as any)) as T extends MyPageSlice ? MyPageSlice : T;
}


export const useThemeSlice = <T = ThemeSlice>(
  selector?: (state: BoundStoreType) => T
) => {
  const defaultSelector = (state: BoundStoreType) => ({
    isDark: state.isDark,
    setIsDark: state.setIsDark,
    isToastOpen: state.isToastOpen,
    alertText: state.alertText,
    bgColor: state.bgColor,
    navSelectedValue: state.navSelectedValue,
    setNavSelected: state.setNavSelected,
    setIsToastOpen: state.setIsToastOpen,
    setAlertText: state.setAlertText,
    setBgColor: state.setBgColor,
  } satisfies ThemeSlice);

  return useBoundStore(selector ?? (defaultSelector as any)) as T extends ThemeSlice ? ThemeSlice : T;
}


export const usePurchaseSlice = <T = PurchaseSlice>(
  selector?: (state: BoundStoreType) => T
) => {
  const defaultSelector = (state: BoundStoreType) => ({
    productDetailData: state.productDetailData,
    setProductDetailData: state.setProductDetailData,
  } satisfies PurchaseSlice);

  return useBoundStore(selector ?? (defaultSelector as any)) as T extends PurchaseSlice ? PurchaseSlice : T;
}


export const useSearchSlice = <T = SearchSlice>(
  selector?: (state: BoundStoreType) => T
) => {
  const defaultSelector = (state: BoundStoreType) => ({
    searchItemsInThisBound: state.searchItemsInThisBound,
    searchItemsInThisBoundAndPeriod: state.searchItemsInThisBoundAndPeriod,
  } satisfies SearchSlice);

  return useBoundStore(selector ?? (defaultSelector as any)) as T extends SearchSlice ? SearchSlice : T;
}


export const useProductSlice = <T = ProductSlice>(
  selector?: (state: BoundStoreType) => T
) => {
  const defaultSelector = (state: BoundStoreType) => ({
    productItem: state.productItem,
    productList: state.productList,
  } satisfies ProductSlice);

  return useBoundStore(selector ?? (defaultSelector as any)) as T extends ProductSlice ? ProductSlice : T;
}


export const useImageSlice = <T = ImageSlice>(
  selector?: (state: BoundStoreType) => T
) => {
  const defaultSelector = (state: BoundStoreType) => ({
    uploadImage: state.uploadImage,
  } satisfies ImageSlice);

  return useBoundStore(selector ?? (defaultSelector as any)) as T extends ImageSlice ? ImageSlice : T;
}


export const useCustomAxiosSlice = <T = customAxiosSlice>(
  selector?: (state: BoundStoreType) => T
) => {
  const defaultSelector = (state: BoundStoreType) => ({
    useCustomAxios: state.useCustomAxios,
  } satisfies customAxiosSlice);

  return useBoundStore(selector ?? (defaultSelector as any)) as T extends customAxiosSlice ? customAxiosSlice : T;
}

