import { TablePagination } from "@mui/material";
import React from "react";

const CustomTablePagination = (props) => {
  const {
    data,
    success,
    total,
    current_page,
    per_page,
    onPageChange,
    onRowsPerPageChange,
  } = props;

  return (
    <TablePagination
      component="div"
      rowsPerPageOptions={[
        5,
        10,
        15,
        {
          label: "All",
          value: parseInt(total),
        },
      ]}
      count={success ? total : 0}
      page={success ? current_page - 1 : 0}
      rowsPerPage={success ? parseInt(per_page) : 5}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};

export default CustomTablePagination;
