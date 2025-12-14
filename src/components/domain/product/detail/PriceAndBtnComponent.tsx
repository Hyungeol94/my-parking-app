import { useNavigate } from "react-router-dom";
import classes from "./PriceAndBtnComponent.module.css";

import HEARTICON from "../../../../assets/images/heart-icon.png";
import { Box } from "@mui/system";
import { useTheme } from "@mui/material";

const PriceAndBtnComponent = ({ product }: { product: ProductItemType }) => {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <div className={classes.wrapper}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          display: "flex",
          alignItems: "center",
          position: "fixed",
          bottom: "0",
          zIndex: 1002,
          maxWidth: "var(--main-max-width)",
          justifyContent: "space-around",
          padding: "10px",
          width: "100%",
        }}
      >
        <div className={classes["util-box"]}>
          <img src={HEARTICON} />
          <p>{product.price}원</p>
        </div>
        <button type="button" onClick={() => navigate("/purchase")}>
          결제하기
        </button>
      </Box>
    </div>
  );
};

export default PriceAndBtnComponent;
