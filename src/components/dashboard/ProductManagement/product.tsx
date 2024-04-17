import CategoryForm from "@components/Forms/categoryForm";
import ProductManagementForm from "@components/Forms/productForm";
import SubHeader from "@components/common/subHeader";
import { useCategoryStore } from "@store/categoryStore";
import { get, post, put } from "@utils/coreApiServices";
import { baseUrl } from "../../../constant";
import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { enqueueSnackbar } from "notistack";
import { Button } from "@mui/material";
import SubCategoryForm from "@components/Forms/subCategoryForm";
import { useProductStore } from "@store/productStore";
import CategoryTable from "./categoryTable";
import CodeManagement from "../codeManagemet/codeManagement";
const CommonDataTable = React.lazy(
  () => import("@components/common/dataTable")
);
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
type CategoryFormValues = {
  category: string;
  parent?: { id: string; name: string };
};
const Product: React.FC = () => {
  const [errorTxt, setErrorTxt] = useState<Record<string, string>>({});
  const [showdialog, setShowdialog] = useState(false);
  const [edit, setEdit] = useState(false);
  const [searchParams] = useSearchParams();
  // const [dataLoading, setDataLoading] = useState(false);
  const [showCatSubCategory, setShowCatSubCategory] = useState<{
    show: boolean;
    name: string;
    id: string;
  }>({ show: false, name: "", id: "" });
  const setCategoryData = useCategoryStore((state) => state.setCategoryData);
  const productData = useProductStore((state) => state.produtData);
  const setProdutData = useProductStore((state) => state.setProdutData);
  const setSubCategoryData = useCategoryStore(
    (state) => state.setSubCategoryData
  );

  const formatedProduct = productData?.map((product, idx) => {
    return {
      sNo: idx + 1,
      productExternalId: product.product_external_id,
      customerId: product.customer_id,
      customerName: product.customer_name,
      productName: product.product_name,
      productId: product.product_id,
      lev1: product.lev1,
      lev1Id: product.lev1Id,
    };
  });

  const setMainCategoryData = useCategoryStore(
    (state) => state.setMainCategoryData
  );
  const [editData, setEditData] = useState<FormValues>({
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
  const handleClose = () => {
    setShowdialog(false);
    setErrorTxt({});
    setShowCatSubCategory({
      show: false,
      name: "",
      id: "",
    });
    setEdit(false);
    setEditData({
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
  };
  const handleSuccess = async () => {
    enqueueSnackbar(`Successfully`, {
      variant: "success",
    });
  };
  const handleCategorySubmit = async (
    e: React.MouseEvent<HTMLButtonElement>,
    values: CategoryFormValues
  ) => {
    e.preventDefault();
    if (!values.category) {
      setErrorTxt({ category: "Please Enter Category Name" });
    } else {
      const res = await post(`${baseUrl}product-management/api/add-category/`, {
        parent_category_id: values.parent ? values.parent.id : "0",
        category_name: values.category,
      });
      if (res?.data.message === "success") {
        handleSuccess();
        getAllCategoryData();
        getMainData();
        handleClose();
      } else {
        enqueueSnackbar({
          variant: "error",
          message: "Something went wrong",
        });
      }
    }
  };
  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement>,
    values: FormValues
  ) => {
    e.preventDefault();
    const updatedErrorTxt: Record<string, string> = {};
    if (!values.parentCategory.id && !edit) {
      updatedErrorTxt.parentCategory = "Please Select Parent category";
    } else if (!values.childCategory.id && !edit) {
      updatedErrorTxt.childCategory = "Please Select Child category";
    } else if (!values.name) {
      updatedErrorTxt.name = "Please Select Product Name";
    }

    if (Object.keys(updatedErrorTxt).length > 0) {
      setErrorTxt(updatedErrorTxt);
      enqueueSnackbar({
        message: updatedErrorTxt[Object.keys(updatedErrorTxt)[0]],
        variant: "error",
      });
    } else {
      let specifications: Record<string, any> = {};

      if (
        values.specifications !== null &&
        values.specifications !== undefined
      ) {
        Object.keys(values.specifications).forEach((key) => {
          const value = values.specifications ? values.specifications[key] : "";
          if (value) {
            specifications[value[0]] = value[1];
          }
        });
      }

      const payload = {
        parent_category: values.parentCategory.id,
        child_category: values.childCategory.id,
        name: values.name,
        is_image_url: "no",
        product_image: "False",
        product_image_url: "",
        product_sku: values.productSKU,
        price: values.price,
        qty_available: values.quantityAvailable,
        max_qty_allowed: values.maxQuantityAllowed,
        min_qty_allowed: values.minQuantityAllowed,
        description: values.productDescription,
        product_points: values.productPoints,
        specifications: specifications,
      };
      const editPayload = {
        product_id: values.id || "",
        // product_external_id: "2539171033228474",
        name: values.name,
        product_external_id: values.productExternalId || "",
        customer: values.customer || "",
        product_sku: values.productSKU,
        price: values.price,
        qty_available: values.quantityAvailable,
        max_qty_allowed: values.maxQuantityAllowed,
        min_qty_allowed: values.minQuantityAllowed,
        description: values.productDescription,
        category: values.parentCategory.id,
        specifications: specifications,
      };
      const res = edit
        ? await put(
            `${baseUrl}product-management/api/all/products/${values.id}/`,
            editPayload
          )
        : await post(
            `${baseUrl}product-management/api/add-product-category-single/`,
            payload
          );
      if (res?.status === 200 || res?.status === 201) {
        enqueueSnackbar({
          message: res.data.message || "Success",
          variant: "success",
        });
        handleClose();
        getAllProductData();
      } else {
        enqueueSnackbar({
          message: res?.data.message || "Something went wrong",
          variant: "error",
        });
        handleClose();
      }
    }
  };
  const menu = [
    { name: "Category", param: "category" },
    { name: "Product", param: "product" },
    { name: "Product Serial Mapping", param: "product-serial-mapping" },
    { name: "Product Serial De-Mapping", param: "product-serial-de-mapping" },
  ];
  const section = searchParams.get("section");
  const getAllProductData = async () => {
    const res = await get(`${baseUrl}product-management/api/products/`);

    setProdutData(res?.data?.data);
  };
  const getProductData = async (item: Record<string, any>) => {
    const res = await get(
      `${baseUrl}product-management/api/all/products/${item.productId}/`
    );
    if (res?.data) {
      const product = res?.data;
      let specifications: Record<string, any> = {};
      if (res.data.specifications) {
        Object.keys(res.data.specifications).map((e, i) => {
          specifications[`${i}`] = [e, res.data.specifications[e]];
        });
      }
      setEditData({
        id: product.product_id,
        parentCategory: { id: product.category, name: "" },
        childCategory: { id: "", name: "" },
        name: product.name,
        productSKU: product.product_sku,
        price: product.price,
        quantityAvailable: product.qty_available,
        productPoints: null,
        maxQuantityAllowed: product.max_qty_allowed,
        minQuantityAllowed: product.min_qty_allowed,
        productDescription: product.description,
        isImageNeeded: "",
        customer: product.customer,
        productExternalId: product.product_external_id,
        specifications: specifications,
      });
      setShowdialog(true);
      setEdit(true);
    }
  };
  const getAllCategoryData = async () => {
    const res = await get(`${baseUrl}product-management/api/all-categories/`);
    setCategoryData(res?.data?.result);
  };
  const getMainData = async () => {
    const res = await get(`${baseUrl}product-management/api/main-categories/`);
    setMainCategoryData(res?.data?.result);
  };
  useEffect(() => {
    getMainData();
    if (section === "category") {
      getAllCategoryData();
    } else if (section === "product") {
      getAllProductData();
    }
  }, [section]);
  const getSubCategories = async (
    item: Record<string, any>,
    fromForm?: boolean
  ) => {
    const res = await post(`${baseUrl}product-management/api/sub-categories/`, {
      category_id: item.categoryId,
    });
    if (!fromForm) {
      setShowCatSubCategory({
        show: true,
        name: item.categoryName,
        id: item.categoryId,
      });
    }
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
  const customAction = (item: Record<string, any>) => {
    return (
      <>
        <Button
          onClick={() =>
            section === "category"
              ? getSubCategories(item)
              : getProductData(item)
          }
        >
          {section === "category" ? "Manage Sub Categories" : "Edit"}
        </Button>
      </>
    );
  };

  const productColumns = [
    {
      accessorKey: "sNo",
      header: "S.No.",
    },
    {
      accessorKey: "productExternalId",
      header: "Product External Id",
    },
    {
      accessorKey: "customerId",
      header: "Customer Id",
    },
    {
      accessorKey: "customerName",
      header: "Customer Name",
    },
    {
      accessorKey: "productName",
      header: "Product Name",
    },
    {
      accessorKey: "productId",
      header: "Product Id",
    },
    {
      accessorKey: "lev1",
      header: "LEV1",
    },
    {
      accessorKey: "lev1Id",
      header: "LEV1 Id",
    },
  ];

  return (
    <>
      <SubHeader menu={menu} />
      <div className="breadcrumb d-flex align-center">
        <p className="module">Product Management</p>
        <p>{">"}</p>
        <p>
          {section === "category"
            ? "Category"
            : section === "product"
            ? "Product"
            : section === "product-serial-mapping"
            ? "Product Serial Mapping"
            : "Product Serial De-Mapping"}
        </p>
      </div>
      {section === "product" || section === "category" ? (
        <>
          <div className="d-flex flex-column form-create-btn">
            <h1>{`Click here to Create New ${
              section === "category" ? "Category" : "Product"
            }`}</h1>
            <button className="create-btn" onClick={() => setShowdialog(true)}>
              {`Create New ${section === "category" ? "Category" : "Product"}`}
            </button>
          </div>
          <div className="table-container">
            {section === "category" ? (
              <CategoryTable customRowAction={customAction} />
            ) : (
              <Suspense fallback={<div id="loader"></div>}>
                <CommonDataTable
                  columns={productColumns}
                  enableRowActions
                  tableData={formatedProduct || []}
                  customRowAction={customAction}
                />
              </Suspense>
            )}
          </div>
          {showdialog ? (
            <>
              {section === "category" ? (
                <CategoryForm
                  handleClose={handleClose}
                  setErrorTxt={setErrorTxt}
                  edit={false}
                  errorTxt={errorTxt}
                  handleSubmit={handleCategorySubmit}
                />
              ) : (
                <ProductManagementForm
                  handleClose={handleClose}
                  edit={edit}
                  getSubCategories={getSubCategories}
                  editData={editData}
                  errorTxt={errorTxt}
                  setErrorTxt={setErrorTxt}
                  handleSubmit={handleSubmit}
                />
              )}
            </>
          ) : (
            <></>
          )}
          {showCatSubCategory.show ? (
            <SubCategoryForm
              handleClose={handleClose}
              parent={showCatSubCategory}
              getSubCategories={getSubCategories}
            />
          ) : (
            <></>
          )}
        </>
      ) : (
        <CodeManagement />
      )}
    </>
  );
};

export default Product;
