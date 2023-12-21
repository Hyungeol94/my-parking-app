import { Button, IconButton, Snackbar } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import React from "react";

interface ToastProps {
  isToastOpen: boolean,
  setIsToastOpen: React.Dispatch<React.SetStateAction<boolean>>,
  alertText: string
}

//useState로 toast, setToastOpen을 만들어서 사용해야 함
export const Toast: React.FC<ToastProps>  = ({
  isToastOpen: toastOpen,
  setIsToastOpen: setToastOpen,
  alertText,
}) => {
    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      setToastOpen(false);
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
      <Snackbar
      open={toastOpen}
      autoHideDuration={2000}
      onClose={handleClose}
      message={alertText}
      action={action}
  />)
}
