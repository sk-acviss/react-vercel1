import { Fade, TextField, MenuItem } from "@mui/material";
import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

interface InputComponentProps {
  label: string;
  placeholder?: string;
  isSelect?: boolean;
  options?: (string | { id: string; name: string })[];
  onChange: (value: string, stateLabel: string) => void;
  value: string | number;
  stateLabel: string;
  disabled?: boolean;
  errorTxt?: string;
  outLined?: boolean;
  type?: string;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  placeholder,
  isSelect,
  options,
  onChange,
  value,
  stateLabel,
  disabled,
  errorTxt,
  outLined,
  type,
}) => {
  return (
    <div className="d-flex flex-column input-wrapper">
      {isSelect ? (
        <TextField
          label={label}
          id={stateLabel}
          disabled={disabled}
          variant={outLined ? "outlined" : "standard"}
          value={value}
          onChange={(e) => onChange(e.target.value, stateLabel)}
          sx={{
            height: "50px",
            "& .MuiInputBase-root.MuiInput-root:before": {
              borderBottom: "2px solid #D1D1D1",
              borderRadius: "6px",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#96D2FF",
              borderRadius: "6px",
            },
            "& .css-1x51dt5-MuiInputBase-input-MuiInput-input": {
              color: "#fff",
            },
            "& .MuiInputBase-root.MuiInput-root:after:hover": {
              borderBottom: "2px solid #96D2FF",
              borderRadius: "6px",
            },
            "& .MuiInputBase-root.MuiInput-root:after": {
              borderBottom: "2px solid #96D2FF",
              borderRadius: "6px",
            },
          }}
          InputLabelProps={{
            sx: {
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "500",
              color: "#D6D6D6",
            },
          }}
          inputProps={{ "aria-label": "Without label" }}
          select
        >
          <MenuItem disabled value="">
            <em>{placeholder}</em>
          </MenuItem>
          {options?.map((item, i) => (
            <MenuItem
              key={i}
              value={typeof item === "object" ? item?.id : item}
            >
              {typeof item === "object"
                ? item?.name
                  ? item?.name
                  : item?.id
                : item}
            </MenuItem>
          ))}
        </TextField>
      ) : (
        <TextField
          disabled={disabled}
          id={stateLabel}
          label={label}
          variant={outLined ? "outlined" : "standard"}
          InputLabelProps={{
            sx: {
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "500",
              color: "#D6D6D6",
            },
          }}
          type={type || "text"}
          value={value ? value : ""}
          sx={{
            height: "50px",
            "& .MuiInputBase-root.MuiInput-root:before": {
              borderBottom: "2px solid #D1D1D1",
              borderRadius: "6px",
            },
            "& .css-1x51dt5-MuiInputBase-input-MuiInput-input": {
              color: "#fff",
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#96D2FF",
              borderRadius: "6px",
            },
            "& .MuiInputBase-root.MuiInput-root:after:hover": {
              borderBottom: "2px solid #96D2FF",
              borderRadius: "6px",
            },
            "& .MuiInputBase-root.MuiInput-root:after": {
              borderBottom: "2px solid #96D2FF",
              borderRadius: "6px",
            },
          }}
          onChange={(e) => onChange(e.target.value, stateLabel)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                {value && (
                  <IconButton
                    disabled={disabled}
                    sx={{
                      color: "#fff",
                    }}
                    onClick={() => onChange("", stateLabel)}
                  >
                    <ClearIcon />
                  </IconButton>
                )}
              </InputAdornment>
            ),
          }}
        />
      )}

      {errorTxt && (
        <Fade in={Boolean(errorTxt.length)} unmountOnExit>
          <small className="mt-10">{errorTxt}</small>
        </Fade>
      )}
    </div>
  );
};

export default InputComponent;
