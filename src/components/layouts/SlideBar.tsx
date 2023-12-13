import { Box } from "@mui/system";
import React, { ReactNode } from "react";
import LOGOBLUE from "../../assets/images/logo-blue.png";
import classes from "./SlideBar.module.css";
import { useTheme } from "@emotion/react";

interface SlideBarProps {
  children?: ReactNode;
}

const SlideBar: React.FC<SlideBarProps> = ({ children }) => {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          height: "100vh",
          width: "var(--slide-width)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: theme.palette.background.default,
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 990,
        }}
      >
        <Box
          sx={{
            marginBottom: "100px",
          }}
        >
          <div className={classes.logoWrapper}>
            <p>마이파킹</p>
            <div className={classes.imgWrapper}>
              <img src={LOGOBLUE} alt="logo-img" />
            </div>
          </div>
        </Box>
        <div>{children}</div>
      </Box>
    </>
  );
};

export default SlideBar;
