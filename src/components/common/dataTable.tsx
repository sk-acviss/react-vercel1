import React from "react";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";
import {
  Box,
  Button,
  IconButton,
  IconButtonProps,
  Menu,
  MenuItem,
  SvgIcon,
  Tooltip,
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import CommonButton from "./commonButton";

// import { IconButtonProps } from "@mui/material";
interface Table {
  getFilteredSelectedRowModel: () => Record<string, any>;
}
interface CommonDataTableProps {
  columns: MRT_ColumnDef<Record<string, any>>[];
  tableData: Record<string, any>[];
  rowCount?: number;
  isLoading?: boolean;
  enableExport?: boolean;
  enableRowSelection?: boolean;
  enableGrouping?: boolean;
  enableEdit?: boolean;
  pagination?: { pageIndex: number; pageSize: number };
  handleEdit?: (table: Table, row: Record<string, any>) => void;
  handleExportRows?: (val: string) => void;
  enableRowActions?: boolean;
  customRowAction?: (row: Record<string, any>) => React.ReactNode;
  setPagination?: React.Dispatch<
    React.SetStateAction<{
      pageIndex: number;
      pageSize: number;
    }>
  >;
}
const nextIconButton = (
  <IconButton>
    <Edit />
  </IconButton>
);
const CommonDataTable: React.FC<CommonDataTableProps> = ({
  columns,
  tableData,
  rowCount,
  isLoading,
  enableRowSelection,
  pagination,
  enableExport,
  handleEdit,
  handleExportRows,
  enableGrouping,
  enableRowActions,
  customRowAction,
  setPagination,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  //   const nextIconButton = (
  //     <IconButton>
  //       <Edit />
  //     </IconButton>
  //   );
  const icons = {
    SearchIcon: () => (
      <SvgIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.3853 15.446C13.0375 16.5229 11.3284 17.0429 9.60922 16.8991C7.88999 16.7552 6.29108 15.9586 5.14088 14.6727C3.99068 13.3869 3.3765 11.7094 3.42449 9.9848C3.47248 8.26024 4.17898 6.6195 5.39891 5.39958C6.61883 4.17965 8.25956 3.47315 9.98413 3.42516C11.7087 3.37717 13.3862 3.99135 14.6721 5.14155C15.9579 6.29175 16.7546 7.89066 16.8984 9.60989C17.0422 11.3291 16.5222 13.0382 15.4453 14.386L20.6013 19.541C20.675 19.6097 20.7341 19.6925 20.7751 19.7845C20.8161 19.8765 20.8381 19.9758 20.8399 20.0765C20.8417 20.1772 20.8232 20.2772 20.7855 20.3706C20.7477 20.464 20.6916 20.5488 20.6204 20.62C20.5492 20.6913 20.4643 20.7474 20.3709 20.7851C20.2775 20.8228 20.1775 20.8414 20.0768 20.8396C19.9761 20.8378 19.8768 20.8158 19.7848 20.7748C19.6928 20.7338 19.61 20.6747 19.5413 20.601L14.3853 15.446ZM6.45933 13.884C5.72537 13.15 5.22549 12.2148 5.02284 11.1968C4.8202 10.1787 4.92391 9.12344 5.32084 8.1643C5.71778 7.20517 6.39014 6.38523 7.25295 5.8081C8.11575 5.23098 9.13027 4.92258 10.1683 4.92189C11.2063 4.92119 12.2213 5.22822 13.0848 5.80418C13.9484 6.38014 14.6219 7.19917 15.0201 8.15778C15.4183 9.11638 15.5235 10.1715 15.3222 11.1898C15.1209 12.2082 14.6223 13.144 13.8893 13.879L13.8843 13.884L13.8793 13.888C12.8944 14.8706 11.5598 15.4221 10.1685 15.4214C8.77725 15.4206 7.44318 14.8677 6.45933 13.884Z"
            fill="#BCBCBC"
          />
        </svg>
      </SvgIcon>
    ),

    FilterListIcon: () => (
      <SvgIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M3 6H21M6 12H18M9 18H15"
            stroke="#BCBCBC"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </SvgIcon>
    ),
    ViewColumnIcon: () => (
      <SvgIcon>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M14.17 6V18C14.17 18.2739 13.9439 18.5 13.67 18.5H10.34C10.0661 18.5 9.84 18.2739 9.84 18V6C9.84 5.72614 10.0661 5.5 10.34 5.5H13.67C13.9439 5.5 14.17 5.72614 14.17 6ZM20 18.5H16.67C16.3894 18.5 16.17 18.2771 16.17 18V6C16.17 5.72614 16.3961 5.5 16.67 5.5H20C20.2739 5.5 20.5 5.72614 20.5 6V18C20.5 18.2739 20.2739 18.5 20 18.5ZM7.83 6V18C7.83 18.2771 7.6106 18.5 7.33 18.5H4C3.72614 18.5 3.5 18.2739 3.5 18V6C3.5 5.72614 3.72614 5.5 4 5.5H7.33C7.60386 5.5 7.83 5.72614 7.83 6Z"
            fill="white"
            stroke="#BCBCBC"
          />
        </svg>
      </SvgIcon>
    ),
  };
  const exportButtonCss = {
    backgroundColor: "#FFFEFE",
    border: "1px solid #E8E8E8",
    color: "#768FA3",
    fontFamily: "Poppins",
    fontSize: "12px",
    fontWeight: "500",
    height: "33px",
    width: "159px",
    lineHeight: "150%",
    borderRadius: "8px",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "#FFFEFE",
    },
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleClose = (val: string) => {
    handleExportRows && handleExportRows(val);
    setAnchorEl(null);
  };

  const TablePaginationActions = ({
    count,
    page,
    rowsPerPage,
  }: {
    count: number;
    page: number;
    rowsPerPage: number;
  }) => {
    const handlePreviousButtonClick = () => {
      setPagination &&
        setPagination({
          pageIndex: page - 1,
          pageSize: pagination?.pageSize || 0,
        });
    };

    const handleNextButtonClick = () => {
      setPagination &&
        setPagination({
          pageIndex: page + 1,
          pageSize: pagination?.pageSize || 0,
        });
    };

    return (
      <div className="d-flex">
        <CommonButton
          txt="Previous"
          disabled={page === 0}
          onClick={handlePreviousButtonClick}
          sx={{ width: "136px", height: "42px", margin: "0px 10px" }}
        />
        <CommonButton
          txt="Next"
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          sx={{ width: "136px", height: "42px", marginRight: "10px" }}
        />
      </div>
    );
  };
  const additionalProps = rowCount ? { onPaginationChange: setPagination } : {};
  return (
    <MaterialReactTable
      muiTablePaperProps={{
        sx: {
          borderRadius: "12px",
          border: "1px solid #DCDCDC",
          boxShadow: "0px 0px 4px 0px rgba(198, 198, 198, 0.80)",
          background: "#FFF",
        },
      }}
      icons={icons}
      enableDensityToggle={false}
      muiTopToolbarProps={{
        sx: {
          borderTopRightRadius: "12px",
          borderTopLeftRadius: "12px",
          "& .MuiIconButton-root": {
            color: "#FFF",
          },
          background: "#012954",
          maxHeight: "40px",
        },
      }}
      muiTableBodyRowProps={{
        sx: {
          height: "80px",
        },
      }}
      muiTableHeadCellProps={{
        align: "left",
        sx: {
          color: "#FFF",
          fontFamily: "Inter",
          background: "#012954",

          fontSize: "14px",
          fontWeight: "500",
        },
      }}
      muiExpandButtonProps={{
        sx: {
          color: "#8D8D8D",
        },
      }}
      muiTableBodyCellProps={{
        align: "left",
        sx: {
          color: "#545353",
          borderBottom: "1px solid #E0E0E0",
          fontSize: "14px",
          fontWeight: "500",
        },
      }}
      muiToolbarAlertBannerProps={{
        sx: {
          display: "none",
        },
      }}
      {...additionalProps}
      muiTablePaginationProps={
        pagination
          ? {
              rowsPerPageOptions: [pagination?.pageSize],
              nextIconButtonProps: { nextIconButton } as IconButtonProps,
              ActionsComponent: TablePaginationActions,
              sx: {
                color: "#8d8d8d",
              },
              count: rowCount ?? 0,
              showFirstButton: false,
              showLastButton: false,
              SelectProps: {
                native: true,
              },
              labelRowsPerPage: "Number of rows visible",
            }
          : {}
      }
      renderTopToolbarCustomActions={({ table }) => (
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            p: "0.5rem",
            flexWrap: "wrap",
            visibility: !enableExport ? "hidden" : "visible",
          }}
        >
          <Button
            sx={exportButtonCss}
            disabled={table.getPrePaginationRowModel().rows.length === 0}
            onClick={(e) => handleClick(e)}
            endIcon={<FileDownloadIcon />}
            variant="contained"
          >
            Export To Csv
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              sx: { width: "200px", marginTop: "5px" },
            }}
          >
            <MenuItem onClick={() => handleClose("today")}>
              {`Export today's data`}
            </MenuItem>
            <MenuItem onClick={() => handleClose("yesderday")}>
              {`Export yesterday's data`}
            </MenuItem>
            <MenuItem onClick={() => handleClose("all")}>Export all</MenuItem>
            <MenuItem onClick={() => handleClose("manual")}>
              Select custom date
            </MenuItem>
          </Menu>
        </Box>
      )}
      positionActionsColumn="last"
      renderRowActions={({ row, table }) => (
        <Box sx={{ display: "flex", gap: "1rem" }}>
          {customRowAction ? customRowAction(row.original) : <></>}

          {handleEdit && (
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => handleEdit(table, row.original)}>
                <Edit />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}
      enableGrouping={enableGrouping}
      initialState={
        enableGrouping
          ? {
              grouping: ["uniqueIdentifier", "invoiceNumber"],
              pagination: { pageIndex: 0, pageSize: 5 },
            }
          : {}
      }
      enableRowActions={enableRowActions}
      manualPagination={Boolean(rowCount)}
      rowCount={rowCount ?? tableData.length}
      rowNumberMode="static"
      enableStickyHeader={true}
      state={
        rowCount
          ? { isLoading: isLoading, pagination: pagination }
          : { isLoading: isLoading }
      }
      enableColumnDragging={false}
      enableRowSelection={enableRowSelection}
      muiBottomToolbarProps={{
        sx: {
          borderBottomRightRadius: "12px",
          borderBottomLeftRadius: "12px",
          background: "#9CB0C6",
          color: "#fff",
        },
      }}
      muiTableBodyProps={{
        sx: {
          background: "#fff",
        },
      }}
      displayColumnDefOptions={{
        "mrt-row-actions": {
          size: 120,
          header: "Action",
        },
      }}
      columns={columns}
      data={tableData}
    />
  );
};

export default CommonDataTable;
