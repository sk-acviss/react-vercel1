import DateFilter from "@components/common/dateFilter";

import { useActivityStore } from "@store/activityStore";
import { get } from "@utils/coreApiServices";
import { baseUrl } from "../../../constant";
import React, { Suspense, useEffect } from "react";
import dayjs from "dayjs";
const CommonDataTable = React.lazy(
  () => import("@components/common/dataTable")
);
const columns = [
  {
    accessorKey: "batchCode",
    header: "Batch Code",
  },
  {
    accessorKey: "serialNumber",
    header: "Serial Number",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "userName",
    header: "User Name",
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    accessorKey: "attempts",
    header: "Attempts",
  },
  {
    accessorKey: "location",
    header: "Location",
  },
  {
    accessorKey: "scanDate",
    header: "Scan Date",
  },
  {
    accessorKey: "appName",
    header: "App Name",
  },
];

const Activity: React.FC<{ fromHome?: boolean }> = ({ fromHome }) => {
  const realTimeScansData = useActivityStore(
    (state) => state.realTimeScansData
  );
  const customDate = useActivityStore((state) => state.customDate);
  const setRealTimeScansData = useActivityStore(
    (state) => state.setRealTimeScansData
  );
  const getRealTimeScanData = async (fromDate?: string, toDate?: string) => {
    const res = await get(
      fromDate
        ? `${baseUrl}insights/api/real-time-scans/?from_date=${fromDate}&to_date=${toDate}`
        : `${baseUrl}insights/api/real-time-scans/`
    );
    setRealTimeScansData(res?.data);
  };
  useEffect(() => {
    if (customDate.startDate && customDate.endDate) {
      getRealTimeScanData(
        customDate.startDate?.format("YYYY-MM-DD"),
        customDate.endDate?.format("YYYY-MM-DD")
      );
    } else {
      getRealTimeScanData();
    }
  }, [customDate.startDate]);
  const formatedRealTimeScans = realTimeScansData?.data.map((e) => {
    return {
      batchCode: e.ucode?.batch?.batch_name || "N/A",
      serialNumber: e.ucode?.serial_number || e.data || "N/A",
      message: e.message || "N/A",
      userName: e.full_name || "N/A",
      mobile: e.mobile_number || "N/A",
      attempts: e.ucode.num_attempts || "N/A",
      location: e.location?.state || "N/A",
      scanDate:
        `${dayjs(
          new Date(e.created_on).toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          })
        ).format("MMM D, YYYY h:mm A")}` || "N/A",
      appName: e.app_name || "N/A",
    };
  });
  return (
    <>
      {!fromHome ? <DateFilter /> : <></>}
      <div className={!fromHome ? "table-container" : ""}>
        <Suspense fallback={<div id="loader"></div>}>
          <CommonDataTable
            columns={columns}
            tableData={formatedRealTimeScans || []}
          />
        </Suspense>
      </div>
    </>
  );
};

export default Activity;
