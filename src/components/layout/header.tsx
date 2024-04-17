import React, { ReactNode, useEffect, useState } from "react";
import { Autocomplete, IconButton, Paper } from "@mui/material";
import Search from "@assets/icons/autosuggest-icon.svg";
import Nofi from "@assets/icons/nofi.svg";
import User from "@assets/icons/profile.svg";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
interface CustomPaperProps {
  children: ReactNode;
}
const CustomPaper = ({ children }: CustomPaperProps) => {
  return (
    <Paper
      sx={{
        width: 268,
        margin: "5px 0",
        padding: 0,
        zIndex: 1,
        position: "absolute",
        left: "-45px",
        listStyle: "none",
        backgroundColor: "#fff",
        color: "#8D8D8D",
        boxShadow: "0px 0px 4px 0px rgba(46, 46, 46, 0.25)",
        borderRadius: "12px",
        overflow: "auto",
        border: "1px solid #DDD",
        "& p": {
          padding: "10px 18px ",
          margin: "3px 0px",
          cursor: "pointer",
        },
        "& li.Mui-focused": {
          backgroundColor: "#E1F2FE",
          cursor: "pointer",
          borderRadius: "12px",
        },
        "& p:hover": {
          backgroundColor: "#E1F2FE",
          borderRadius: "12px",
        },
        "& p:active": {
          backgroundColor: "#E1F2FE",
          borderRadius: "12px",
        },
      }}
    >
      {children}
    </Paper>
  );
};
const Header: React.FC = () => {
  const [isAutoCompleteActive, setIsAutoCompleteActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (sessionStorage.getItem("activeTollSite")) {
      setInputValue(sessionStorage.getItem("activeTollSite") || "");
    }
  }, [sessionStorage.getItem("activeTollSite")]);
  const location = useLocation();
  const activeTollSite = sessionStorage.getItem("activeTollSite");
  const navData = [
    {
      name: "Dashboard",

      slug: "/",
    },
    {
      name: "Product Management",

      slug: "/product-management",
    },
    {
      name: "User Management",

      slug: "/user-management",
    },

    {
      name: "Code Management",

      slug: "/code-management",
    },
  ];
  const tollSitesList = Object.keys({
    Vantech: ["Hyderabad"],
    "Prasad Seeds": ["Kolkata"],
    "SACL(Saraswati Agro)": ["Derrabasi"],
    "Baroda Agro": ["Baroda"],
    "PL Agro": ["Chennai"],
    "Shanmuka Agro": ["Hyderabad"],
    PPICSL: ["Mohali"],
  });
  return (
    <header>
      <div className="header-wrapper d-flex align-center w-100">
        <div
          className="empty-header"
          style={{ width: "260px", height: "96px" }}
        ></div>
        <div className="d-flex align-center justify-between inner-header">
          <div className="page-info d-flex flex-column">
            <p className="page">
              {navData.find((e) => e.slug === location.pathname)?.name}
            </p>
            {/* <p>Details of Product</p> */}
          </div>
          <div className="searchbar-nofi-wrapper align-center d-none">
            <div
              className={`${
                isAutoCompleteActive ? "active-bar" : ""
              } searchbar-wrapper d-flex align-center`}
            >
              <div className="searchbar-img">
                <img src={Search} />
              </div>
              <Autocomplete
                sx={{
                  display: "inline-block",
                  "& input": {
                    width: "180px",
                    backgroundColor: "#fff",
                    color: "#000",
                  },
                }}
                PaperComponent={
                  CustomPaper as React.JSXElementConstructor<
                    React.HTMLAttributes<HTMLElement>
                  >
                }
                defaultValue={
                  tollSitesList.find((e) => e === activeTollSite) ?? null
                }
                onChange={(event, option) => {
                  sessionStorage.setItem(
                    "activeTollSite",
                    option ? option : ""
                  ),
                    console.log(event);

                  window.location.reload();
                }}
                disabled={activeTollSite ? true : false}
                getOptionLabel={(option) => option}
                renderGroup={(params) => (
                  <li>
                    <ul style={{ padding: "10px" }}>
                      <strong>{params.group}</strong>
                      {params.children}
                    </ul>
                  </li>
                )}
                renderOption={(props, option) => (
                  <li {...props}>
                    <p>{option}</p>
                  </li>
                )}
                options={tollSitesList}
                renderInput={(params) => (
                  <div ref={params.InputProps.ref}>
                    <input
                      type="text"
                      placeholder="Toller site"
                      {...params.inputProps}
                      onChange={(e) => {
                        setInputValue(e.target.value);
                        params.inputProps.onChange &&
                          params.inputProps.onChange(e);
                      }}
                      onFocus={(e) => {
                        setIsAutoCompleteActive(true);
                        params.inputProps.onFocus &&
                          params.inputProps.onFocus(e);
                      }}
                      onBlur={(e) => {
                        setIsAutoCompleteActive(false);
                        params.inputProps.onBlur && params.inputProps.onBlur(e);
                      }}
                    />
                  </div>
                )}
              />

              <div className="ac-icon d-flex align-center">
                {activeTollSite && inputValue?.length ? (
                  <IconButton
                    onClick={() => {
                      sessionStorage.removeItem("activeTollSite");
                      window.location.reload();
                    }}
                    sx={{
                      color: "#fff",
                      border: "1px solid #96d2ff",

                      background: "#96d2ff",
                      height: "18px",
                      width: "18px",
                      "&:hover": {
                        background: "#96d2ff",
                        color: "#fff",
                      },
                    }}
                  >
                    <CloseIcon
                      sx={{
                        height: "15px",
                        width: "15px",
                      }}
                    />
                  </IconButton>
                ) : (
                  <>
                    {isAutoCompleteActive ? (
                      <KeyboardArrowDownRoundedIcon sx={{ color: "#96d2ff" }} />
                    ) : (
                      <ArrowDropDownRoundedIcon sx={{ color: "#9CB0C6" }} />
                    )}
                  </>
                )}
              </div>
            </div>
            <img src={Nofi} />
            <img src={User} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
