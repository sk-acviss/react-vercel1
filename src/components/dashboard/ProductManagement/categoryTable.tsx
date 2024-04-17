import { useCategoryStore } from "@store/categoryStore";
import React, { Suspense } from "react";
const CommonDataTable = React.lazy(
  () => import("@components/common/dataTable")
);

const CategoryTable: React.FC<{ customRowAction?: (row: Record<string, any>) => React.ReactNode;}> = ({customRowAction}) => {
    const mainCategoryData = useCategoryStore(
      (state) => state.mainCategoryData
    );
    const formatedMainCategoryData = mainCategoryData?.map((cat, idx) => {
      return {
        sNo: idx + 1,
        categoryName: cat.category_name,
        categoryId: cat.category_id,
      };
    });
  const categoryColumns = [
    {
      accessorKey: "sNo",
      header: "S.No.",
    },
    {
      accessorKey: "categoryId",
      header: "Category Id",
    },
    {
      accessorKey: "categoryName",
      header: "Category Name",
    },
  ];
  return (
    <>
      <Suspense fallback={<div id="loader"></div>}>
        <CommonDataTable
          columns={categoryColumns}
          tableData={formatedMainCategoryData || []}
          enableRowActions
          customRowAction={customRowAction}
        />
      </Suspense>
    </>
  );
};

export default CategoryTable;
