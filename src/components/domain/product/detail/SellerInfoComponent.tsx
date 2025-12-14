import { useNavigate } from "react-router-dom";

import classes from "./SellerInfoComponent.module.css";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";

import { useMyPageSlice, useThemeSlice } from "../../../../store";
import DEFAUlT_AVATAR from "../../../../assets/images/default-avatar.png";

const SellerInfoComponent = ({ product }: { product: ProductItemType }) => {
  const navigate = useNavigate();
  const { isDark }  = useThemeSlice();
  const { myInfo: userInfo } = useMyPageSlice();

  // 문제 :  현재 로그인한 유저의 이미지가 보여버림
  // 등록한 판매자의 이미지가 보여야함
  console.log(userInfo.extra.profileImage);

  return (
    <Box
      sx={{
        borderBottom: isDark
          ? "1px solid var(--color-white)"
          : "1px solid var(--color-gray-300)",
      }}
      //해당 판매자가 올린 상품에 대한 리뷰
    >
      <div className={classes.wrapper}>
        <div className={classes["seller-info"]}>
          <Button
            onClick={() => {
              navigate(`/reply/seller-replies/${product.seller_id}`);
            }}
            className={classes.btn}
          >
            <div className={classes["avatar-box"]}>
              <img
                src={
                  userInfo.extra.profileImage
                    ? userInfo.extra.profileImage
                    : DEFAUlT_AVATAR
                }
                alt="사용자 아바타 이미지"
              />
            </div>
            <h4>{product.extra?.sellerNickname}</h4>
          </Button>
        </div>

        {/* 북마크 기능 추후 도입 예정 */}
        <Button className={classes.scrapBtn}>
          <BookmarkIcon
            fontSize="large"
            sx={{
              color: "var(--color-primary-600)",
            }}
          />
        </Button>
      </div>
    </Box>
  );
};

export default SellerInfoComponent;
