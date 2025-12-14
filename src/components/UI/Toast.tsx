import { Alert, Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import { useThemeSlice } from "../../store";
import { Box } from "@mui/system";

interface ToastProps {
  isToastOpen: boolean;
  alertText: string;
  bgColor?: string;
}

//useState로 isToastOpen, setIsToastOpen을 만들어서 사용해야 함
export const Toast: React.FC<ToastProps> = ({
  isToastOpen: toastOpen,
  alertText,
  bgColor,
}) => {
  const { setIsToastOpen } = useThemeSlice();

  const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setIsToastOpen(false);
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <Box
    // sx={{
    //   position: "fixed",
    //   top: 0,
    // }}
    >
      <Snackbar
        open={toastOpen}
        autoHideDuration={1500}
        onClose={handleClose}
        action={action}
        color={"#fff"}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          sx={{
            color: "#fff",
            backgroundColor: `${bgColor || "var(--toast-success)"}`,
            "& .MuiAlert-icon": {
              color: "#fff",
            },
          }}
          onClose={() => {
            setIsToastOpen(false);
          }}
        >
          {alertText}
        </Alert>
      </Snackbar>
    </Box>
  );
};
