import React from "react";
import { Box, TableCell, TableRow, Typography } from "@mui/material";
import ImgNoRecordsFound from "../Img/SVG/No Records Found.svg";

const NoRecordsFound = (props) => {
  const { category } = props;
  return (
    <>
      <TableRow>
        <TableCell colSpan={999} rowSpan={999} sx={{ borderBottom: "none" }}>
          <Box
            className="noRecordsFoundImg"
            sx={category ? { marginTop: "-20px!important" } : null}
          />
        </TableCell>
      </TableRow>
    </>
  );
};

export default NoRecordsFound;
