import { baseUrl } from "../../../constant";
import React, { Suspense, useEffect, useRef, useState } from "react";
import Logs from "@assets/icons/logs.svg";
import DateFilter from "@components/common/dateFilter";
const CommonDataTable = React.lazy(
  () => import("@components/common/dataTable")
);
import { useSearchParams } from "react-router-dom";
import CodeDemappingForm from "./codeDemapping";
import { useCategoryStore } from "@store/categoryStore";
import { get, post } from "@utils/coreApiServices";
import { enqueueSnackbar } from "notistack";
import { useProductStore } from "@store/productStore";

interface FormData {
  startValue: string;
  endValue: string;
  batchNo: string;
  parentCategory: { id: string; name: string };
  childCategory: { id: string; name: string };
  productSearchValue: string;
  PCSearchValue: string;
  CCSearchValue: string;
  products: {
    name: string;
    id: string;
  };
}
interface FormValues {
  startValue: string;
  endValue: string;
}
const CodeManagement: React.FC = () => {
  const [pagination, setPagination] = useState<{
    pageIndex: number;
    pageSize: number;
  }>({ pageIndex: 0, pageSize: 10 });
  const subCategoryProducts = useCategoryStore(
    (state) => state.subCategoryProducts
  );
  const setSubCategoryProducts = useCategoryStore(
    (state) => state.setSubCategoryProducts
  );
  const mainCategoryData = useCategoryStore((state) => state.mainCategoryData);
  const formatedMainCategoryData = mainCategoryData?.map((cat) => {
    return {
      name: cat.category_name,
      id: cat.category_id,
    };
  });
  const mappingHistory = useProductStore((state) => state.mappingHistory);
  const setMappingHistory = useProductStore((state) => state.setMappingHistory);
  const setMainCategoryData = useCategoryStore(
    (state) => state.setMainCategoryData
  );
  const setSubCategoryData = useCategoryStore(
    (state) => state.setSubCategoryData
  );
  const [errorTxt, setErrorTxt] = useState<Record<string, string>>({});
  const getMainData = async () => {
    const res = await get(`${baseUrl}product-management/api/main-categories/`);
    setMainCategoryData(res?.data?.result);
  };
  const subcategoryData = useCategoryStore((state) => state.subcategoryData);

  const [searchParams] = useSearchParams();
  const isMapping = searchParams.get("section") === "product-serial-mapping";
  const [formData, setFormData] = useState<FormData>({
    startValue: "",
    endValue: "",
    batchNo: "",
    productSearchValue: "",
    PCSearchValue: "",
    CCSearchValue: "",
    products: {
      name: "",
      id: "",
    },
    parentCategory: { id: "", name: "" },
    childCategory: { id: "", name: "" },
  });
  const formatedSubcategoryData = subcategoryData?.map((cat) => {
    return {
      name:
        formData.parentCategory.id === cat.category_id
          ? `${cat.category_name} [parent]`
          : cat.category_name,
      id: `${cat.category_id}`,
    };
  });
  const [showdemappingForm, setShowDemappingForm] = useState(false);
  const [showLogs, setShowLogs] = useState(false);

  const [suggestions, setSuggestions] = useState<
    {
      name: string;
      id: string;
    }[]
  >([]);
  const [dataLoading, setdataLoading] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState({
    val: false,
    key: "",
  });
  const handleDemapSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>,
    values: FormValues
  ) => {
    e.preventDefault();
    const res = await post(
      `${baseUrl}product-management/api/product-demapping/`,
      {
        upload_by: "2",
        serial_number_start: parseInt(values.startValue),
        serial_number_end: parseInt(values.endValue),
      }
    );
    setdataLoading(false);

    if (res?.status === 200 || res?.status === 201) {
      enqueueSnackbar({
        message: res.data.message || "Successfully Done",
        variant: "success",
      });
      setShowDemappingForm(false);
    } else {
      enqueueSnackbar({
        message: res?.data.message || "Something Went Wrong",
        variant: "error",
      });
    }
  };
  const formatedMappingHistory = mappingHistory?.data.map((e, i) => {
    return {
      sNo: i + 1,
      serialNumber: e.serial_number,
      productName: e.product_name,
      mappedON: e.uploaded,
    };
  });
  const columns = [
    {
      accessorKey: "sNo",
      header: "S.No.",
    },
    {
      accessorKey: "serialNumber",
      header: "Serial Number",
    },
    {
      accessorKey: "productName",
      header: "Product Name",
    },
    {
      accessorKey: "mappedON",
      header: "Mapped ON",
    },
  ];

  const fetchSuggestions = async (value: string, key: string) => {
    setLoadingSuggestions({ key, val: true });

    if (value !== "") {
      const targetArray =
        key === "pc"
          ? formatedMainCategoryData
          : key === "cc"
          ? formatedSubcategoryData
          : subCategoryProducts;
      const results = targetArray.filter((e) =>
        e.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(
        results.length ? results : [{ name: "No results Found", id: "" }]
      );
      setLoadingSuggestions({ key, val: false });
    } else {
      const targetArray =
        key === "pc"
          ? formatedMainCategoryData
          : key === "cc"
          ? formatedSubcategoryData
          : subCategoryProducts;
      setSuggestions(targetArray);
      setLoadingSuggestions({ key, val: false });
    }
  };

  const handleSuggestionClick = (
    suggestion: { name: string; id: string },
    key: string
  ) => {
    if (suggestion.name !== "No results") {
      if (key === "pc") {
        setFormData({
          ...formData,
          parentCategory: suggestion,
        });
        getSubCategories(suggestion);
      } else if (key === "cc") {
        setFormData({
          ...formData,
          childCategory: suggestion,
        });
        getSubCategoryProducts(suggestion);
      } else {
        setFormData({
          ...formData,
          products: suggestion,
        });
      }

      setSuggestions([]);
    }
  };
  const getSubCategoryProducts = async (item: Record<string, any>) => {
    const res = await post(
      `${baseUrl}product-management/api/product-sub-category/`,
      {
        sub_category_id: item.id,
      }
    );

    const productArray = res?.data.result.map(
      (e: { product_name: string; product_external_id: string }) => {
        return {
          name: e.product_name,
          id: e.product_external_id,
        };
      }
    );
    setSubCategoryProducts(productArray);
  };
  const getSubCategories = async (item: Record<string, any>) => {
    const res = await post(`${baseUrl}product-management/api/sub-categories/`, {
      category_id: item.id,
    });

    const inputObject = res?.data.result?.[0];
    setSubCategoryData(
      Array.from({ length: 4 }, (_, i) => {
        const levelKey = `lev${i + 1}`;
        const levelIdKey = `lev${i + 1}Id`;
        return inputObject[levelKey] !== null
          ? {
              category_id: inputObject[levelIdKey]?.toString(),
              category_name: inputObject[levelKey],
            }
          : null;
      }).filter(Boolean) as { category_id: string; category_name: string }[]
    );
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "productSearchValue") {
      setFormData((prevData) => ({
        ...prevData,
        productSearchValue: value,
        products: {
          name: "",
          id: "",
        },
      }));

      fetchSuggestions(value, "product");
    } else if (name === "CCSearchValue") {
      setFormData((prevData) => ({
        ...prevData,
        CCSearchValue: value,
        childCategory: {
          name: "",
          id: "",
        },
      }));

      fetchSuggestions(value, "cc");
    } else if (name === "PCSearchValue") {
      setFormData((prevData) => ({
        ...prevData,
        PCSearchValue: value,
        parentCategory: {
          name: "",
          id: "",
        },
      }));

      fetchSuggestions(value, "pc");
    } else if (
      name === "startValue" ||
      name === "endValue" ||
      name === "totalNumberofBox" ||
      name === "totalNumberofValume"
    ) {
      const numre = /^[0-9\b]+$/;
      if (value.trim() === "" || Number(value) > 0 || numre.test(value)) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  const getMappingHistory = async (page?: number) => {
    const res = await get(
      `${baseUrl}product-management/api/mapped-serial-numbers/?page=${page}`
    );
    setMappingHistory(res?.data);
  };
  const mapProductsData = async () => {
    const res = await post(`${baseUrl}product-management/api/serial-mapping/`, {
      upload_by: "2",
      product_external_id: parseInt(formData.products.id),
      serial_number_start: parseInt(formData.startValue),
      serial_number_end: parseInt(formData.endValue),
    });
    setdataLoading(false);

    if (res?.status === 200 || res?.status === 201) {
      enqueueSnackbar({
        message: res.data.message || "Successfully Mapped",
        variant: "success",
      });
      setFormData({
        startValue: "",
        endValue: "",
        batchNo: "",
        productSearchValue: "",
        PCSearchValue: "",
        CCSearchValue: "",
        products: {
          name: "",
          id: "",
        },
        parentCategory: { id: "", name: "" },
        childCategory: { id: "", name: "" },
      });
    } else {
      enqueueSnackbar({
        message: res?.data.message || "Something Went Wrong",
        variant: "error",
      });
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (
      formData.parentCategory.name.trim() === "" ||
      Number(formData.parentCategory) <= 0
    ) {
      newErrors.parentCategory = "Please select product";

      isValid = false;
    } else if (
      formData.childCategory.name.trim() === "" ||
      Number(formData.childCategory) <= 0
    ) {
      (newErrors.childCategory = "Please select product"), (isValid = false);
    } else if (
      formData.products.name.trim() === "" ||
      Number(formData.products) <= 0
    ) {
      (newErrors.products = "Please select product"), (isValid = false);
    } else if (
      formData.startValue.trim() === "" ||
      Number(formData.startValue) < 0
    ) {
      newErrors.startValue = "Value must be a positive number";
      isValid = false;
    } else if (
      formData.endValue.trim() === "" ||
      Number(formData.endValue) < 0 ||
      Number(formData.endValue) < Number(formData.startValue)
    ) {
      newErrors.endValue =
        "Value must be a positive number and greater than the start value";
      isValid = false;
    } else if (
      Number(formData.endValue) - Number(formData.startValue) >
      50000
    ) {
      newErrors.endValue =
        "The difference between the two values must be less than 50,000";
      isValid = false;
    }

    if (isValid) {
      setdataLoading(true);
      mapProductsData();
    } else {
      if (Object.keys(newErrors).length > 0) {
        enqueueSnackbar({
          message: newErrors[Object.keys(newErrors)[0]],
          variant: "error",
        });
      }
    }
  };
  const productInputRef = useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    getMainData();
  }, []);
  useEffect(() => {
    if (showLogs) {
      getMappingHistory(pagination.pageIndex + 1);
    }
  }, [showLogs, pagination]);
  //   useClickOutside(productInputRef, () => {
  //     setProductInput("");
  //     setSuggestions([]);
  //   });
  return (
    <>
      {dataLoading ? <></> : <></>}

      {isMapping ? (
        <>
          <div className="d-flex justify-between form-create-btn align-center">
            <h1>Enter the Product details to map a Code</h1>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="common-btn logs-btn d-flex align-center "
            >
              Logs <img src={Logs} />
            </button>
          </div>
          <div className="code-magement-wrapper">
            <div className="code-management-form d-flex flex-column">
              <form onSubmit={handleSubmit}>
                <div className="code-management-form-inputs d-flex flex-wrap">
                  <div
                    className="input-wrapper d-flex flex-column"
                    ref={productInputRef}
                  >
                    <label>Main Category:</label>
                    <input
                      name="PCSearchValue"
                      autoComplete="off"
                      placeholder="Select Main Category"
                      onFocus={() => fetchSuggestions("", "pc")}
                      value={
                        formData.parentCategory.name || formData.PCSearchValue
                      }
                      onChange={handleChange}
                    />

                    {suggestions.length > 0 &&
                      loadingSuggestions.key === "pc" && (
                        <div className="suggestion-box">
                          {loadingSuggestions.val && <div>Loading...</div>}
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="suggestion"
                              onClick={() =>
                                handleSuggestionClick(suggestion, "pc")
                              }
                            >
                              {suggestion.name}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  <div
                    className="input-wrapper d-flex flex-column"
                    ref={productInputRef}
                  >
                    <label>SUB Category:</label>
                    <input
                      name="CCSearchValue"
                      autoComplete="off"
                      placeholder="Select SUB Category"
                      onFocus={() => fetchSuggestions("", "cc")}
                      value={
                        formData.childCategory.name || formData.CCSearchValue
                      }
                      onChange={handleChange}
                    />

                    {suggestions.length > 0 &&
                      loadingSuggestions.key === "cc" && (
                        <div className="suggestion-box">
                          {loadingSuggestions.val && <div>Loading...</div>}
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="suggestion"
                              onClick={() =>
                                handleSuggestionClick(suggestion, "cc")
                              }
                            >
                              {suggestion.name}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  <div
                    className="input-wrapper d-flex flex-column"
                    ref={productInputRef}
                  >
                    <label>Product:</label>
                    <input
                      name="productSearchValue"
                      autoComplete="off"
                      placeholder="Enter Product"
                      onFocus={() => fetchSuggestions("", "product")}
                      value={
                        formData.products.name || formData.productSearchValue
                      }
                      onChange={handleChange}
                    />

                    {suggestions.length > 0 &&
                      loadingSuggestions.key === "product" && (
                        <div className="suggestion-box">
                          {loadingSuggestions.val && <div>Loading...</div>}
                          {suggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="suggestion"
                              onClick={() =>
                                handleSuggestionClick(suggestion, "product")
                              }
                            >
                              {suggestion.name}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  {/* <div className="input-wrapper d-flex flex-column">
                    <label>Batch No. :</label>
                    <input
                      name="batchNo"
                      placeholder="Enter Batch No."
                      disabled={!formData.products.name}
                      value={formData.batchNo}
                      onChange={handleChange}
                    />
                    {errors.batchNo && (
                      <div className="error">{errors.batchNo}</div>
                    )}
                  </div> */}
                  <div className="input-wrapper d-flex flex-column">
                    <label>Start of the serial number :</label>
                    <input
                      name="startValue"
                      placeholder="Enter the start of the serial number series"
                      value={formData.startValue}
                      disabled={!formData.products.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="input-wrapper d-flex flex-column">
                    <label>End of the serial number :</label>
                    <input
                      name="endValue"
                      placeholder="Enter the end of the serial number series"
                      value={formData.endValue}
                      disabled={!formData.products.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="code-management-form-btns-wrapper d-flex align-center justify-around">
                  <button className="common-active-btn" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="d-flex justify-between form-create-btn align-center mb-30">
            <button
              className="create-btn"
              onClick={() => setShowDemappingForm(true)}
            >
              Manual Demap
            </button>
            <button
              onClick={() => setShowLogs(!showLogs)}
              className="common-btn logs-btn d-flex align-center "
            >
              Logs <img src={Logs} />
            </button>
          </div>
          {showdemappingForm ? (
            <CodeDemappingForm
              errorTxt={errorTxt}
              handleClose={() => setShowDemappingForm(false)}
              setErrorTxt={setErrorTxt}
              handleSubmit={handleDemapSubmit}
            />
          ) : (
            <></>
          )}
        </>
      )}
      {showLogs ? (
        <div className="filter-table-wrapper d-flex flex-column">
          {" "}
          <DateFilter />
          <Suspense fallback={<div id="loader"></div>}>
            <CommonDataTable
              columns={columns}
              tableData={formatedMappingHistory || []}
              pagination={pagination}
              setPagination={setPagination}
              rowCount={mappingHistory?.count || 0}
            />
          </Suspense>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default CodeManagement;
