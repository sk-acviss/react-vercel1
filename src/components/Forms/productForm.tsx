import React, { useEffect, useState } from "react";
import FormDialogue from "../common/formDialogue";
import CommonInput from "@components/common/commonInput";
import Delete from "@assets/icons/delete.svg";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useCategoryStore } from "@store/categoryStore";
type FormValues = {
  parentCategory: { id: string; name: string };
  childCategory: { id: string; name: string };
  name: string;
  id?: string;
  productSKU: string;
  price: number | null;
  quantityAvailable: number | null;
  productPoints: number | null;
  maxQuantityAllowed: number | null;
  minQuantityAllowed: number | null;
  productDescription: string;
  isImageNeeded: string;
  customer?: number | null;
  productExternalId?: number | null;
  specifications: null | Record<string, any>;
};
type FormProps = {
  handleClose: () => void;
  edit: boolean;
  editData: FormValues;
  handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement>,
    value: FormValues
  ) => void;
  getSubCategories: (item: Record<string, any>, fromForm?: boolean) => void;
  errorTxt: Record<string, string>;
  setErrorTxt: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};
const ProductManagementForm: React.FC<FormProps> = ({
  handleClose,
  errorTxt,
  setErrorTxt,
  edit,
  editData,
  getSubCategories,
  handleSubmit,
}) => {
  const mainCategoryData = useCategoryStore((state) => state.mainCategoryData);
  const formatedMainCategoryData = mainCategoryData?.map((cat) => {
    return {
      name: cat.category_name,
      id: `${cat.category_id}`,
    };
  });

  const [values, setValues] = useState<FormValues>({
    parentCategory: { id: "", name: "" },
    childCategory: { id: "", name: "" },
    name: "",
    productSKU: "",
    price: null,
    quantityAvailable: null,
    productPoints: null,
    maxQuantityAllowed: null,
    minQuantityAllowed: null,
    isImageNeeded: "",
    productDescription: "",
    specifications: null,
  });
  const subcategoryData = useCategoryStore((state) => state.subcategoryData);
  const formatedSubcategoryData = subcategoryData?.map((cat) => {
    return {
      name:
        values.parentCategory.id === cat.category_id
          ? `${cat.category_name} [parent]`
          : cat.category_name,
      id: `${cat.category_id}`,
    };
  });

  useEffect(() => {
    if (edit && editData?.id) {
      setValues({
        ...editData,
      });
    } else if (!edit) {
      setValues({
        parentCategory: { id: "", name: "" },
        childCategory: { id: "", name: "" },
        name: "",
        productSKU: "",
        price: null,
        quantityAvailable: null,
        productPoints: null,
        maxQuantityAllowed: null,
        minQuantityAllowed: null,
        productDescription: "",
        isImageNeeded: "",
        specifications: null,
      });
    }
  }, [edit, editData]);

  const handleChange = async (val: string, key: string, idx?: string) => {
    setErrorTxt({});
    const numre = /^[0-9\b]+$/;
    const decimalRegex = /^(([0-9.]?)*)+$/;
    if (key === "Key" && values.specifications && idx !== undefined) {
      const updatedSpecifications = { ...values.specifications };
      updatedSpecifications[idx][0] = val;
      setValues({ ...values, specifications: updatedSpecifications });
    } else if (key === "Value" && values.specifications && idx !== undefined) {
      const updatedSpecifications = { ...values.specifications };
      updatedSpecifications[idx][1] = val;
      setValues({ ...values, specifications: updatedSpecifications });
    } else if (key === "Delete" && values.specifications && idx !== undefined) {
      const updatedSpecifications = { ...values.specifications };
      delete updatedSpecifications[idx]; // Remove key-value pair
      setValues({ ...values, specifications: updatedSpecifications });
    } else if (key === "parentCategory") {
      setValues((prev) => ({
        ...prev,
        [key]: formatedMainCategoryData?.find((e) => e.id === val) || {
          name: "",
          id: "",
        },
      }));
      getSubCategories(
        {
          categoryId: formatedMainCategoryData?.find((e) => e.id === val)?.id,
        },
        true
      );
    } else if (key === "childCategory") {
      setValues((prev) => ({
        ...prev,
        [key]: formatedSubcategoryData?.find((e) => e.id === val) || {
          name: "",
          id: "",
        },
      }));
    } else if (key === "price") {
      if (val === "" || decimalRegex.test(val)) {
        setValues((prevValues) => ({
          ...prevValues,
          [key]: parseInt(val),
        }));
      }
    } else if (
      key === "quantityAvailable" ||
      key === "productPoints" ||
      key === "maxQuantityAllowed" ||
      key === "minQuantityAllowed"
    ) {
      if (val === "" || numre.test(val)) {
        setValues((prevValues) => ({
          ...prevValues,
          [key]: parseInt(val),
        }));
      }
    } else {
      setValues((prev) => ({
        ...prev,
        [key]: val,
      }));
    }
  };
  const handleAddSpecification = () => {
    if (!values.specifications) {
      setValues({ ...values, specifications: { "0": ["", ""] } });
    } else {
      setValues({
        ...values,
        specifications: {
          ...values.specifications,
          [`${Object.keys(values.specifications).length}`]: ["", ""],
        },
      });
    }
  };
  return (
    <FormDialogue
      title={edit ? "Edit Product" : "Add Product to Category - Single Product"}
    >
      <div className="entity-input-wrapper">
        <div className="d-flex input-row  flex-wrap">
          {!edit ? (
            <>
              <div className="small-input">
                <CommonInput
                  required
                  label={"Parent Category"}
                  onChange={(val) => handleChange(val, "parentCategory")}
                  placeholder={"Parent Category"}
                  isSelect
                  options={formatedMainCategoryData}
                  value={values.parentCategory?.id}
                  errorTxt={errorTxt?.parentCategory}
                  stateLabel="parentCategory"
                />
              </div>
              <div className="small-input">
                <CommonInput
                  label={"Child Category"}
                  onChange={(val) => handleChange(val, "childCategory")}
                  placeholder={"Child Category"}
                  required
                  isSelect
                  options={formatedSubcategoryData}
                  disabled={!values.parentCategory?.id}
                  value={values.childCategory?.id}
                  errorTxt={errorTxt?.childCategory}
                  stateLabel="childCategory"
                />
              </div>
            </>
          ) : (
            <></>
          )}
          <div className="small-input">
            <CommonInput
              label={"Name"}
              required
              onChange={(val) => handleChange(val, "name")}
              placeholder={"Name"}
              value={values.name || ""}
              errorTxt={errorTxt?.name}
              stateLabel="name"
            />
          </div>
          <div className="small-input">
            <div className="d-flex flex-column input-wrapper common-input-wrapper">
              <label>
                {"Do you have image URL?"} :<span className="red">{"*"}</span>
              </label>
              <FormControl>
                <RadioGroup
                  sx={{
                    color: "#FFF",
                    "& .css-ahj2mt-MuiTypography-root": {
                      color: "#FFF",
                      fontSize: "14px ",
                      fontWeight: "500",
                    },
                  }}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={values.isImageNeeded}
                  onChange={(e) =>
                    handleChange(e.target.value, "isImageNeeded")
                  }
                >
                  <FormControlLabel
                    value="No"
                    control={<Radio />}
                    label="No"
                    checked
                  />
                  <FormControlLabel
                    value="Yes"
                    disabled
                    control={<Radio />}
                    label="Yes"
                  />
                </RadioGroup>
              </FormControl>
            </div>
          </div>
        </div>
        <div className="d-flex input-row  flex-wrap">
          <div className="small-input">
            <CommonInput
              label={"Product SKU"}
              onChange={(val) => handleChange(val, "productSKU")}
              placeholder={"Product SKU"}
              value={values.productSKU}
              errorTxt={errorTxt?.productSKU}
              stateLabel="productSKU"
            />
          </div>
          <div className="small-input">
            <CommonInput
              label={"Price"}
              onChange={(val) => handleChange(val, "price")}
              placeholder={"Price"}
              value={values.price || ""}
              errorTxt={errorTxt?.price}
              stateLabel="price"
            />
          </div>
          <div className="small-input">
            <CommonInput
              label={"Quantity Available"}
              onChange={(val) => handleChange(val, "quantityAvailable")}
              placeholder={"Quantity Available"}
              value={values.quantityAvailable || ""}
              errorTxt={errorTxt?.quantityAvailable}
              stateLabel="quantityAvailable"
            />
          </div>
          {!edit ? (
            <div className="small-input">
              <CommonInput
                label={"Product Points"}
                onChange={(val) => handleChange(val, "productPoints")}
                placeholder={"Product Points"}
                value={values.productPoints || ""}
                errorTxt={errorTxt?.productPoints}
                stateLabel="productPoints"
              />
            </div>
          ) : (
            <></>
          )}
          <div className="small-input">
            <CommonInput
              label={"Max. Quantity Allowed"}
              onChange={(val) => handleChange(val, "maxQuantityAllowed")}
              placeholder={"Max. Quantity Allowed"}
              value={values.maxQuantityAllowed || ""}
              errorTxt={errorTxt?.maxQuantityAllowed}
              stateLabel="maxQuantityAllowed"
            />
          </div>
          <div className="small-input">
            <CommonInput
              label={"Min. Quantity Allowed"}
              onChange={(val) => handleChange(val, "minQuantityAllowed")}
              placeholder={"Min. Quantity Allowed"}
              value={values.minQuantityAllowed || ""}
              errorTxt={errorTxt?.minQuantityAllowed}
              stateLabel="minQuantityAllowed"
            />
          </div>
          <div className="small-input">
            <CommonInput
              label={"Product Description"}
              onChange={(val) => handleChange(val, "productDescription")}
              placeholder={"Product Description"}
              value={values.productDescription}
              errorTxt={errorTxt?.productDescription}
              stateLabel="productDescription"
            />
          </div>
          <div className="d-flex  add-specification-wrapper flex-column w-100">
            <div className=" align-center add-specification-head">
              <p>S. No</p>
              <p>Key</p>
              <p>Value</p>
              <p>Delete</p>
            </div>
            {values.specifications ? (
              Object.keys(values.specifications).map((data, idx) => (
                <div className="align-center add-specification-row">
                  <p>{idx + 1}</p>
                  <CommonInput
                    label={"Key"}
                    onChange={(val) => handleChange(val, "Key", data)}
                    placeholder={"Key"}
                    value={
                      values.specifications
                        ? values.specifications[data][0]
                        : ""
                    }
                    freeSolo
                    stateLabel="Key"
                  />
                  <CommonInput
                    label={"Value"}
                    freeSolo
                    onChange={(val) => handleChange(val, "Value", data)}
                    placeholder={"Value"}
                    value={
                      values.specifications
                        ? values.specifications[data][1]
                        : ""
                    }
                    stateLabel="Value"
                  />
                  <div
                    className="img"
                    onClick={() => handleChange("", "Delete", data)}
                  >
                    <img src={Delete} />
                  </div>
                </div>
              ))
            ) : (
              <></>
            )}
            <button onClick={() => handleAddSpecification()}>
              {"+Add Specification"}
            </button>
          </div>
        </div>
      </div>

      <div className="model-buttons d-flex ">
        <button
          className={`button-save`}
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
export default ProductManagementForm;
