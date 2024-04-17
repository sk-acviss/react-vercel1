import { Drawer } from "@mui/material";
import React from "react";
import User from "@assets/icons/UserIcon.svg";
import UserManagement from "@assets/icons/user_side.svg";
import CodeMangement from "@assets/icons/codeManagement.svg";
import Dashboard from "@assets/icons/dashboard.svg";
import Product from "@assets/icons/product.svg";
import UserManagementGrey from "@assets/icons/userManagement-grey.svg";
import CodeMangementGrey from "@assets/icons/codeManagement-grey.svg";
import DashboardGrey from "@assets/icons/dashboard-grey.svg";
import ProductGrey from "@assets/icons/productManagement-grey.svg";
import { Link, useLocation } from "react-router-dom";
const Sidebar: React.FC = () => {
  const drawerWidth = "260px";
  const location = useLocation();
  const parsedUserData = localStorage.getItem("userData");
  const userData =
    typeof parsedUserData === "string" ? JSON.parse(parsedUserData) : null;
  const navData = [
    {
      name: "Dashboard",
      img: DashboardGrey,
      activeImg: Dashboard,
      slug: "/",
    },
    {
      name: "Activity",
      img: CodeMangementGrey,
      activeImg: CodeMangement,
      slug: "/activity",
    },
    {
      name: "Product Management",
      img: ProductGrey,
      activeImg: Product,
      slug: "/product-management",
    },
    {
      name: "User Management",
      img: UserManagementGrey,
      activeImg: UserManagement,
      slug: "/user-management",
    },
  ];
  return (
    <>
      <Drawer
        className="origin-sidebar"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          overflowX: "hidden",
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            border: "none",
            background: "#FFF",
            borderRight: "1px solid #FFF",
            zIndex: 998,
            overflowX: "hidden",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <aside>
          <div className="sidebar-wrapper">
            <div className="acviss-logo d-flex flex-column align-start">
              {/* <p className="acviss">ACVISS</p>
              <p className="trust">Building Trust</p> */}
            </div>
            <div className="user-details-wrapper d-flex align-center">
              <img src={User} />
              <div className="user-details d-flex flex-column align-start">
                <p className="name">{userData?.full_name}</p>
                <p className="role">Admin</p>
                <p className="email">{userData?.email}</p>
              </div>
            </div>
            <ul className="navigation-menu-wrapper d-flex flex-column align-start">
              {navData.map((menu, idx) => (
                <Link
                  key={idx}
                  style={{ color: "inherit", textDecoration: "none" }}
                  to={`${menu.slug}`}
                >
                  <li
                    className={`menu d-flex align-center ${
                      location.pathname === menu.slug ? "active" : ""
                    }`}
                  >
                    <img
                      src={
                        location.pathname === menu.slug
                          ? menu.activeImg
                          : menu.img
                      }
                    />
                    <p>{menu.name}</p>
                  </li>
                </Link>
              ))}
            </ul>
            {/* <div className="flash-newfeatures d-flex flex-column align-start">
              <p className="title">New Features</p>
              <p>Lorum Ipsum lorum Ipsum ksmmjfkman Create task</p>
              <button>Check Status</button>
            </div> */}
          </div>
        </aside>
      </Drawer>
    </>
  );
};

export default Sidebar;
