import React, { useState } from "react";
import InputComponent from "@components/common/inputComponent";
import FormDialogue from "@components/common/formDialogue";
interface FormValues {
  startValue: string;
  endValue: string;
}
interface FormProps {
  handleClose: () => void;
  handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement>,
    value: FormValues
  ) => void;
  errorTxt: Record<string, string>;
  setErrorTxt: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}
const CodeDemappingForm: React.FC<FormProps> = ({
  handleClose,
  errorTxt,
  setErrorTxt,

  handleSubmit,
}) => {
  const [values, setValues] = useState<FormValues>({
    startValue: "",
    endValue: "",
  });

  const handleChange = (val: string, key: string) => {
    const numre = /^[0-9\b]+$/;
    setErrorTxt({});

    if (val === "" || numre.test(val)) {
      setValues(() => ({
        ...values,
        [key]: val,
      }));
    }
  };

  return (
    <FormDialogue title={"Manual Demap"}>
      <div className="entity-input-wrapper">
        {/* <LocationPicker onChange={handleLocationChange} /> */}
        <div className="d-flex input-row  flex-column">
          <div className="small-input">
            <InputComponent
              label={"Start of the serial number series"}
              onChange={handleChange}
              errorTxt={errorTxt?.startValue}
              placeholder={"Start of the serial number series"}
              value={values.startValue}
              stateLabel={"startValue"}
            />
          </div>
          <div className="small-input">
            <InputComponent
              label={"End of the serial number series"}
              errorTxt={errorTxt?.endValue}
              onChange={handleChange}
              placeholder={"End of the serial number series"}
              value={values.endValue}
              stateLabel={"endValue"}
            />
          </div>
        </div>
      </div>
      <div className="model-buttons d-flex ">
        <button
          className="button-save"
          onClick={(e) => handleSubmit(e, values)}
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

export default CodeDemappingForm;
