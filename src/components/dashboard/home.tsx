import React, { Suspense } from "react";
import "../../assets/css/home.scss";
import ScanScoundCard from "@components/common/scanScoundCard";
import DateFilter from "@components/common/dateFilter";
import Activity from "./activity/activity";

const IndiaBubbleMap = React.lazy(
  () => import("@components/common/indiaHeatMap")
);
const Home: React.FC = () => {
  return (
    <>
      <DateFilter />
      <ScanScoundCard />
      <div className="table-track-wrapper d-flex w-100 justify-between">
        <div className="home-activity d-flex flex-column">
          <p className="title">Real time Scan :</p>
          <Activity fromHome />
        </div>
        <div className="trakker">
          <p className="title">Heat Map :</p>
          <div className="map d-flex align-center w-100 justify-center">
            <Suspense fallback={<div id="loader"></div>}>
              <IndiaBubbleMap />
            </Suspense>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
