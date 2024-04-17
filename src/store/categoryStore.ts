import { create } from "zustand";

type Category = {
  category_id: string;
  category_name: string;
};
type Product = {
  id: string;
  name: string;
};
type CategoryStore = {
  categoryData: Category[];
  subCategoryProducts: Product[];
  setCategoryData: (val: Category[]) => void;
  mainCategoryData: Category[];
  setMainCategoryData: (val: Category[]) => void;
  subcategoryData: Category[];
  setSubCategoryData: (val: Category[]) => void;
  setSubCategoryProducts: (val: Product[]) => void;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  categoryData: [],
  subCategoryProducts: [],
  setCategoryData: (val: Category[]) => {
    set(() => ({ categoryData: val }));
  },
  mainCategoryData: [],
  setMainCategoryData: (val: Category[]) => {
    set(() => ({ mainCategoryData: val }));
  },
  subcategoryData: [],
  setSubCategoryData: (val: Category[]) => {
    set(() => ({ subcategoryData: val }));
  },
  setSubCategoryProducts: (val: Product[]) => {
    set(() => ({ subCategoryProducts: val }));
  },
}));
