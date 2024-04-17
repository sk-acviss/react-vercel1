import React from "react";
import { Button, ButtonProps } from "@mui/material";

interface CommonButtonProps extends ButtonProps {
  txt: React.ReactNode;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  disabled,
  onClick,
  sx,
  txt,
}) => {
  return (
    <Button
      onClick={onClick}
      sx={{
        ...sx,
        borderRadius: "8px",
        textTransform: "none",
        border: "1px solid #1665A0",
        background: "#FFF",
        "&:hover": {
          boxShadow: "0px 0px 4px 0px #2E2E2E",
          border: "1px solid #015799",
          background: "#015799",
          color: "#FFF",
        },
        color: "#1665A0",
      }}
      disabled={disabled}
    >
      {txt}
    </Button>
  );
};

export default CommonButton;
