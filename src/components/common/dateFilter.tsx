import React, { useEffect, useState } from "react";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Slide, Switch, styled } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { useActivityStore } from "@store/activityStore";
const DateFilter: React.FC = () => {
  const [showCustomDate, setShowCustomDate] = useState(false);
  const filterOptions = ["Today", "This Week", "This Month"];
  const [activeFilter, setActiveFilter] = useState("");
  const customDate = useActivityStore((state) => state.customDate);
  const [filters, setFilters] = useState<{
    endDate: null | Dayjs;
    startDate: null | Dayjs;
  }>({ startDate: null, endDate: null });
  const setCustomDate = useActivityStore((state) => state.setCustomDate);
  const calculateActiveFilterDates = (filter: string) => {
    const currentDate = dayjs();
    if (activeFilter !== filter) {
      setActiveFilter(filter);
      switch (filter) {
        case "Today":
          setCustomDate({ startDate: currentDate, endDate: currentDate });
          return;
        case "This Week":
          setCustomDate({
            startDate: currentDate.startOf("week"),
            endDate: currentDate.endOf("week"),
          });
          return;

        case "This Month":
          setCustomDate({
            startDate: currentDate.startOf("month"),
            endDate: currentDate.endOf("month"),
          });
          return;
        default:
          return { startDate: currentDate, endDate: currentDate };
      }
    } else {
      setActiveFilter("");
      setCustomDate({ startDate: null, endDate: null });
    }
  };
  const validateDateRange = () => {
    if (JSON.stringify(customDate) === JSON.stringify(filters)) {
      return false;
    }
    const differenceInYears = filters.endDate?.diff(filters.startDate, "year");
    return differenceInYears !== undefined ? differenceInYears < 1 : false;
  };
  useEffect(() => {
    return () => {
      setCustomDate({ startDate: null, endDate: null });
    };
  }, []);
  const handleCustomSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCustomDate({
      startDate: filters.startDate,
      endDate: filters.endDate,
    });
  };
  const CustomSwitch = styled(Switch)(() => ({
    padding: 8,
    width: "70px",
    "& .MuiSwitch-track": {
      borderRadius: 22 / 2,
      "&:before, &:after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 24,
        height: 18,
      },
    },
    "& .Mui-checked": {
      transform: "translateX(31px) !important",
    },
    "& .MuiSwitch-thumb": {
      boxShadow: "none",
      color: "#012954",
      width: 18,
      height: 18,
      margin: 1,
    },
  }));
  return (
    <>
      <div className="filter-options d-flex align-center justify-between">
        <p className="title">Date Filter</p>
        {filterOptions.map((option, idx) => (
          <div className="filter d-flex align-center" key={idx}>
            <p>{option}</p>
            <CustomSwitch
              name="Today"
              checked={activeFilter === option}
              onChange={() => calculateActiveFilterDates(option)}
            />
          </div>
        ))}

        <button
          className="btn"
          onClick={() => setShowCustomDate((prevValue) => !prevValue)}
        >
          {showCustomDate ? "Hide Customise" : "Customise"}
        </button>
      </div>
      {showCustomDate ? (
        <Slide direction="up" in={showCustomDate} mountOnEnter unmountOnExit>
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="home-date-filter d-flex align-center justify-between filter-options">
                <div className="date-input-wrapper d-flex flex-column">
                  <label>From:</label>
                  <DesktopDatePicker
                    value={filters.startDate}
                    onChange={(date) =>
                      setFilters({ ...filters, startDate: dayjs(date) })
                    }
                    maxDate={filters.endDate}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "10px 14px",
                      },
                      height: "30px",
                      width: "300px",
                    }}
                    format="DD-MM-YYYY"
                  />
                </div>
                <div className="date-input-wrapper d-flex flex-column">
                  <label>To:</label>
                  <DesktopDatePicker
                    value={filters.endDate}
                    onChange={(date) =>
                      setFilters({ ...filters, endDate: dayjs(date) })
                    }
                    minDate={filters.startDate}
                    maxDate={dayjs()}
                    sx={{
                      "& .MuiInputBase-input": {
                        padding: "10px 14px",
                      },
                      height: "30px",
                      width: "300px",
                    }}
                    format="DD-MM-YYYY"
                  />
                </div>
                <button
                  className={`btn ${
                    !validateDateRange() ? "disabled-btn" : ""
                  }`}
                  disabled={!validateDateRange()}
                  onClick={handleCustomSubmit}
                >
                  Submit Filter
                </button>
              </div>
            </LocalizationProvider>
          </div>
        </Slide>
      ) : (
        <></>
      )}
    </>
  );
};

export default DateFilter;
