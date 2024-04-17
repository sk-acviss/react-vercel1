import { Dayjs } from "dayjs";
import { create } from "zustand";
type ProductVerification = {
  id: number;
  created_on: string;
  ucode: {
    serial_number: number;
    batch: {
      batch_name: string;
    };
    num_attempts: number;
    ucode: string;
    id: number;
  };
  parameters_received: string;
  location: Record<string, any> | null;
  data: string;
  app_name: string;
  response_code: number;
  message: string;
  mobile_number: string;
  full_name: string;
};
type ScanData = {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: ProductVerification[];
};
type ScansCount = {
  total_users: number;
  total_user_approved: number;
  total_scan_data: number;
  original_scan_data: number;
  fake_scan_data: number;
};

interface ActivityStore {
  realTimeScansData: ScanData | null;
  scansCount: ScansCount | null;
  setScansCount: (val: ScansCount) => void;
  setRealTimeScansData: (val: ScanData) => void;
  customDate: {
    startDate: null | Dayjs;
    endDate: null | Dayjs;
  };
  setCustomDate: (dates: {
    startDate: null | Dayjs;
    endDate: null | Dayjs;
  }) => void;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  customDate: {
    startDate: null,
    endDate: null,
  },
  scansCount: null,
  setScansCount: (val: ScansCount) => {
    set(() => ({ scansCount: val }));
  },
  setCustomDate: (dates) => set({ customDate: dates }),
  realTimeScansData: null,
  setRealTimeScansData: (val: ScanData) => {
    set(() => ({ realTimeScansData: val }));
  },
}));
