import React from "react";
import "../../Style/parentSidebar.scss";
import bgImage from "../../Img/CardBG.svg";

import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";

import { Box, Typography, useMediaQuery } from "@mui/material";
import {
  HowToReg,
  ManageAccountsSharp,
  RemoveFromQueue,
  RequestQuote,
  RuleFolder,
  SettingsApplications,
  ShoppingBag,
  TransferWithinAStation,
} from "@mui/icons-material";
import Cards from "../../Components/Reusable/Cards";

const RequestList = [
  {
    icon: <RequestQuote />,
    label: "Requisition",
    description: "Requesting of Fixed Assets",
    path: "/request/requisition",
  },

  {
    icon: <TransferWithinAStation />,
    label: "Transfer",
    description: "Requesting for Asset Transfer",
    path: "/request/transfer",
  },

  {
    icon: <RemoveFromQueue />,
    label: "Pull-Out",
    description: "Requesting for Asset Pull-Out",
    path: "/request/pull-out",
  },

  {
    icon: <RuleFolder />,
    label: "Evaluation",
    description: "Requesting for Asset Evaluation",
    path: "/request/evaluation",
  },

  {
    icon: <ShoppingBag />,
    label: "Disposal",
    description: "List of For Disposal Items",
    path: "/request/disposal",
  },

  {
    icon: <ShoppingBag />,
    label: "Purchase Request",
    description: "Matching of Purchase Request",
    path: "/request/purchase-request",
  },
];

const Request = () => {
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 590px)");
  // console.log(location.pathname);

  return (
    <>
      {location.pathname === "/request" ? (
        <>
          <Typography
            color="secondary"
            sx={{
              fontFamily: "Anton, Roboto, Impact, Helvetica",
              fontSize: "25px",
              alignSelf: isSmallScreen ? "center" : "flex-start",
              marginLeft: isSmallScreen ? null : "30px",
            }}
          >
            Request
          </Typography>
          <Box className="parentSidebar">
            <Box className="parentSidebar__container">
              <Box className="parentSidebar__wrapper">
                {RequestList.map((data, index) => {
                  return <Cards data={data} key={index} />;
                })}
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        <Outlet />
      )}
    </>
    // <Outlet />
  );
};

export default Request;
