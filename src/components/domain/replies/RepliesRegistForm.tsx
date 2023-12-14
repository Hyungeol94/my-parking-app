import { InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import React, { SyntheticEvent } from "react";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";

interface RepliesProps {
  value: string;
  // 리뷰입력창
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  //별점 드래그시
  handleDrag: (e: SyntheticEvent<Element, Event>) => void;
  // drag drop 시
  ratingValue: number;
}

const RepliesRegistForm: React.FC<RepliesProps> = ({
  value,
  onChange,
  onSubmit,
  handleDrag,
  ratingValue,
}) => {
  return (
    <>
      <form onSubmit={onSubmit}>
        <input type="text" value={value} onChange={onChange} />
        <button>후기 등록하기 </button>
        <InputLabel id="demo-simple-select-label">Age</InputLabel>
        <Box
          sx={{
            "& > legend": { mt: 2 },
          }}
        >
          <Typography component="legend">별점을 선택해주세요</Typography>
          <Rating name="basic" value={ratingValue} onChange={handleDrag} />
        </Box>
      </form>
    </>
  );
};

export default RepliesRegistForm;
