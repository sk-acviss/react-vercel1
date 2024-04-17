import React from "react";

interface CommonInputProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  isSelect?: boolean;
  options?: (string | { id: string; name: string })[];
  onChange: (value: string, stateLabel: string, idx?: string) => void;
  value: string | number;
  stateLabel: string;
  disabled?: boolean;
  errorTxt?: string;
  outLined?: boolean;
  type?: string;
  freeSolo?: boolean;
}

const CommonInput: React.FC<CommonInputProps> = ({
  label,
  placeholder,
  isSelect,
  options,
  onChange,
  value,
  stateLabel,
  disabled,
  errorTxt,
  required,
  freeSolo,
  type,
}) => {
  return (
    <div className="d-flex flex-column input-wrapper common-input-wrapper">
      {freeSolo ? (
        <></>
      ) : (
        <label>
          {label} :<span className="red">{required ? "*" : ""}</span>
        </label>
      )}
      {isSelect ? (
        <select
          id={stateLabel}
          name={label}
          value={value as string}
          onChange={(e) => onChange(e.target.value, stateLabel)}
          disabled={disabled}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options?.map((item, i) => (
            <option key={i} value={typeof item === "object" ? item?.id : item}>
              {typeof item === "object"
                ? item?.name
                  ? item?.name
                  : item?.id
                : item}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={label}
          id={stateLabel}
          type={type || "text"}
          value={value as string}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value, stateLabel)}
          disabled={disabled}
        />
      )}

      {errorTxt && <small className="mt-10">{errorTxt}</small>}
    </div>
  );
};

export default CommonInput;
