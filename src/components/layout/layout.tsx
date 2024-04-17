import React from "react";
import Sidebar from "./sidebar";
import "../../assets/css/header&sidebar.scss";
import Header from "./header";
import Home from "@components/dashboard/home";
import { useLocation } from "react-router-dom";
import Product from "@components/dashboard/ProductManagement/product";
import Activity from "@components/dashboard/activity/activity";
const Layout: React.FC = () => {
  const location = useLocation();
  return (
    <>
      <Header />
      <div className="d-flex w-100">
        <Sidebar />
        <main>
          <div className="container">
            {location.pathname === "/product-management" ? (
              <Product />
            ) : location.pathname === "/activity" ? (
              <Activity />
            ) : location.pathname === "/" ? (
              <Home />
            ) : (
              <></>
            )}
          </div>
        </main>
      </div>
    </>
  );
};
export default Layout;
