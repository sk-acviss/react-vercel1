import React, { useEffect } from "react";
import ValidScan from "@assets/icons/valid-scan.svg";
import TotalScan from "@assets/icons/total-scan.svg";
import FackScan from "@assets/icons/fake-scan.svg";
import { get } from "@utils/coreApiServices";
import { useActivityStore } from "@store/activityStore";
import { baseUrl } from "../../constant";
const ScanScoundCard: React.FC = () => {
  const scansCount = useActivityStore((state) => state.scansCount);
  const setScansCount = useActivityStore((state) => state.setScansCount);
  const customDate = useActivityStore((state) => state.customDate);
  const getScanCounts = async (fromDate?: string, toDate?: string) => {
    const res = await get(
      fromDate
        ? `${baseUrl}loyalty-insights/api/sign-up-approval/?from_date=${fromDate}&to_date=${toDate}`
        : `${baseUrl}loyalty-insights/api/sign-up-approval/`
    );
    setScansCount(res?.data);
  };

  useEffect(() => {
    if (customDate.startDate && customDate.endDate) {
      getScanCounts(
        customDate.startDate?.format("YYYY-MM-DD"),
        customDate.endDate?.format("YYYY-MM-DD")
      );
    } else {
      getScanCounts();
    }
  }, [customDate.startDate]);

  return (
    <div className="scan-counts-wrapper d-flex w-100 align-center justify-between">
      <div className="Card d-flex align-center total">
        <div className="img d-flex align-center justify-center">
          <img src={TotalScan} />
        </div>
        <div className="title-count d-flex flex-column">
          <p>Total Scans</p>
          <p className="count">{scansCount?.total_scan_data}</p>
        </div>
      </div>
      <div className="Card d-flex align-center fake">
        <div className="img d-flex align-center justify-center">
          <img src={FackScan} />
        </div>
        <div className="title-count d-flex flex-column">
          <p>Total Fake Scans</p>
          <p className="count">{scansCount?.fake_scan_data}</p>
        </div>
      </div>
      <div className="Card d-flex align-center valid">
        <div className="img d-flex align-center justify-center">
          <img src={ValidScan} />
        </div>
        <div className="title-count d-flex flex-column">
          <p>Total Acquired Users</p>
          <p className="count">{scansCount?.total_users}</p>
        </div>
      </div>
    </div>
  );
};

export default ScanScoundCard;
