import React from "react";
import Lottie from "lottie-react";
import ImportLoading from "../../assets/Lottie/ImportLoading";
import ImportLoadingCircle from "../../assets/Lottie/ImportLoadingCircle";
import { Box, Typography } from "@mui/material";

export const ImportingData = ({ text }) => {
  return (
    <Box
      sx={{
        display: "flex",
        height: "250px",
        ml: "5px",
        // width: "350px",
        position: "absolute",
        overflow: "hidden",
      }}
    >
      <Lottie
        animationData={ImportLoading}
        style={{ padding: 0, margin: 0, marginTop: "-40px" }}
      />
      {text && (
        <Typography fontSize="2rem" color="white" mt={2}>
          {text ? text : ""}
        </Typography>
      )}
    </Box>
  );
};
