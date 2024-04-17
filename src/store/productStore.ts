import { create } from "zustand";

type Product = {
  product_external_id: string;
  customer_id: number;
  customer_name: string;
  product_name: string;
  product_id: number;
  lev1: string;
  lev1Id: number;
};
interface Pagination {
  start: number;
  counter: number[];
  end: number;
  previous: boolean;
  next: boolean;
  page: number;
}

interface DataItem {
  customer_id: number;
  product_name: string;
  id: number;
  Mapped: boolean | null;
  uploaded: string;
  serial_number: number;
  category_name: string;
}

interface MapingHistoryResponse {
  page_title: string;
  roles: number[];
  deleted: boolean;
  serial_number: string;
  product_name: string;
  count: number;
  pagination: Pagination;
  data: DataItem[];
}

type ProdutStore = {
  produtData: Product[];
  setProdutData: (val: Product[]) => void;
  mappingHistory: MapingHistoryResponse | null;
  setMappingHistory: (val: MapingHistoryResponse | null) => void;
};

export const useProductStore = create<ProdutStore>((set) => ({
  produtData: [],
  mappingHistory: null,
  setMappingHistory: (val: MapingHistoryResponse | null) => {
    set(() => ({ mappingHistory: val }));
  },
  setProdutData: (val: Product[]) => {
    set(() => ({ produtData: val }));
  },
}));
