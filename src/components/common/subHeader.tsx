import React, { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const SubHeader: React.FC<{ menu: { name: string; param: string }[] }> = ({
  menu,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    if (!searchParams.get("section")) {
      setSearchParams({ section: menu[0].param });
    }
  }, []);

  return (
    <div className="sub-header-wrapper d-flex align-center w-100">
      <div
        className="empty-header"
        style={{ width: "260px", height: "96px" }}
      ></div>
      <div className="d-flex align-center  inner-sub-header">
        {menu?.map((item) => (
          <button
            className={
              searchParams.get("section") === item.param ? "active" : ""
            }
            key={item.name}
            onClick={() => setSearchParams({ section: item.param })}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubHeader;
