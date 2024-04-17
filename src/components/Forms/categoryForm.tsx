import FormDialogue from "@components/common/formDialogue";
import InputComponent from "@components/common/inputComponent";
import { Autocomplete, InputLabel, Paper, TextField } from "@mui/material";
import { useCategoryStore } from "@store/categoryStore";
import React, { ReactNode, useState } from "react";
type FormValues = {
  category: string;
parent?: { id: string; name: string };
};
type FormProps = {
  handleClose: () => void;
  edit: boolean;
  //   editData: FormValues;
  handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement>,
    value: FormValues
  ) => void;
  errorTxt: Record<string, string>;
  setErrorTxt: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};
interface CustomPaperProps {
  children: ReactNode;
}
const CustomPaper = ({ children }: CustomPaperProps) => {
  return (
    <Paper
      sx={{
        width: "100%",
        margin: "5px 0",
        padding: 0,
        zIndex: 1700,
        position: "absolute",
        left: 0,
        listStyle: "none",
        backgroundColor: "#fff",
        color: "#8D8D8D",
        boxShadow: "0px 0px 4px 0px rgba(46, 46, 46, 0.25)",
        borderRadius: "12px",
        overflow: "auto",
        border: "1px solid #DDD",
        "& p": {
          padding: "10px 18px ",
          margin: "3px 0px",
          cursor: "pointer",
        },
        "& li.Mui-focused": {
          backgroundColor: "#E1F2FE",
          cursor: "pointer",
          borderRadius: "12px",
        },
        "& p:hover": {
          backgroundColor: "#E1F2FE",
          borderRadius: "12px",
        },
        "& p:active": {
          backgroundColor: "#E1F2FE",
          borderRadius: "12px",
        },
      }}
    >
      {children}
    </Paper>
  );
};
const CategoryForm: React.FC<FormProps> = ({
  handleClose,
  errorTxt,
  edit,
  handleSubmit,
  setErrorTxt,
}) => {
  const [values, setValues] = useState<FormValues>({ category: "" });
  const handleChange = (val: string, key: string) => {
    setErrorTxt({});

    setValues((prev) => ({
      ...prev,
      [key]: val,
    }));
  };
  const categoryData = useCategoryStore((state) => state.categoryData);
  return (
    <FormDialogue title={edit ? "Edit Category" : "Create New Category"}>
      <div className="entity-input-wrapper">
        <div className="d-flex input-row  flex-column">
          <div className="small-input">
            <InputComponent
              label={"Category Name"}
              onChange={(val) => handleChange(val, "category")}
              placeholder={"Category Name"}
              value={values.category}
              errorTxt={errorTxt?.category}
              stateLabel="category"
            />
          </div>
          <Autocomplete
            sx={{
              display: "inline-block",
              position: "relative",
              "& input": {
                width: "180px",

                color: "#000",
              },
            }}
            PaperComponent={
              CustomPaper as React.JSXElementConstructor<
                React.HTMLAttributes<HTMLElement>
              >
            }
            onChange={(event, option) => {
              event.preventDefault();
              setValues({
                ...values,
                parent: {
                  name: option?.category_name || "",
                  id: option?.category_id || "",
                },
              });
            }}
            // disabled={activeTollSite ? true : false}
            getOptionLabel={(option) => option.category_name}
            renderOption={(props, option) => (
              <li {...props}>
                <p>{option.category_name}</p>
              </li>
            )}
            options={categoryData}
            renderInput={(params) => (
              <div className="small-input">
                <div className="d-flex flex-column input-wrapper">
                  <InputLabel
                    sx={{
                      fontSize: "18px",
                      fontStyle: "normal",
                      fontWeight: "500",
                      color: "#D6D6D6", // Use a valid color value
                    }}
                  >
                    {"parent"}
                  </InputLabel>
                  <TextField
                    variant={"standard"}
                    ref={params.InputProps.ref}
                    {...params}
                    type={"text"}
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
                      "& .MuiInputBase-root.MuiInput-root:after:hover": {
                        borderBottom: "2px solid #96D2FF",
                        borderRadius: "6px",
                      },
                      "& .MuiInputBase-root.MuiInput-root:after": {
                        borderBottom: "2px solid #96D2FF",
                        borderRadius: "6px",
                      },
                    }}
                  />
                </div>
              </div>
            )}
          />
        </div>
      </div>

      <div className="model-buttons d-flex ">
        <button
          className={`button-save `}
          onClick={(e) => handleSubmit(e, values)}
          // disabled={edit ? deepEqual(editData, values) : false}
        >
          Save
        </button>{" "}
        <button className="button-delete" onClick={handleClose}>
          Cancel
        </button>
      </div>
    </FormDialogue>
  );
};

export default CategoryForm;
