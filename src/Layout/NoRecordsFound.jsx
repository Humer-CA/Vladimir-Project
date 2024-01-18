import React from "react";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import ImgNoRecordsFound from "../Img/SVG/ImgNoRecordsFound.svg";

const NoRecordsFound = (props) => {
  const { category, request } = props;
  return (
    <>
      <TableRow>
        <TableCell
          className="centeredTableCell"
          colSpan={999}
          rowSpan={999}
          sx={{
            borderBottom: "none",
            height: category ? "calc(100vh - 440px)" : request ? "calc(100vh - 360px)" : "calc(100vh - 390px)",
          }}
        >
          <Box className="noRecordsFoundImg" />
        </TableCell>
      </TableRow>
    </>
  );
};

export default NoRecordsFound;
