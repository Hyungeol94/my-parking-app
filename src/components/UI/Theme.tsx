import React, { ReactNode } from "react";
import { useThemeSlice } from "../../store";
import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme } from "@mui/material";

interface ThemeProps {
  children: ReactNode;
}

const Theme: React.FC<ThemeProps> = ({ children }) => {
  const { isDark } = useThemeSlice();

  const darkTheme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600, // 예시로 600으로 설정되어 있습니다. 실제로 사용하는 값으로 변경해야 합니다.
        md: 960,
        lg: 900,
        xl: 1920,
      },
    },
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: "#90caf9", // 다크 모드에서의 primary 색상
      },
      secondary: {
        main: "#ffcc80", // 다크 모드에서의 secondary 색상
      },
      background: {
        default: isDark ? "#212121" : "#fff", // 기본 배경색
        paper: isDark ? "#2c2c2c" : "#fff", // 다크 모드에서의 페이퍼 배경색
      },
      text: {
        primary: isDark ? "#fff" : "#000", // 다크 모드에서의 텍스트 색상
        secondary: "#989898", // 다크 모드에서의 보조 텍스트 색상
      },

      // 기타 색상들을 필요에 따라 추가할 수 있습니다.
    },
  });

  return (
    <>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline>{children}</CssBaseline>
      </ThemeProvider>
    </>
  );
};

export default Theme;
