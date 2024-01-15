import React from "react";
import "../../Style/parentSidebar.scss";
import bgImage from "../../Img/CardBG.svg";

import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";

import { Box, Typography, useMediaQuery } from "@mui/material";
import {
  AssignmentTurnedIn,
  CallReceived,
  HowToReg,
  ManageAccountsSharp,
  RemoveFromQueue,
  RequestQuote,
  RuleFolder,
  SettingsApplications,
  ShoppingBag,
  ShoppingBasket,
  TransferWithinAStation,
} from "@mui/icons-material";
import Cards from "../../Components/Reusable/Cards";

const RequestList = [
  {
    icon: <AssignmentTurnedIn />,
    label: "Requisition",
    description: "Requesting of Fixed Assets",
    path: "/request/requisition",
  },

  {
    icon: <ShoppingBasket />,
    label: "Purchase Request",
    description: "Matching of Purchase Request",
    path: "/request/purchase-request",
  },

  {
    icon: <CallReceived />,
    label: "Receiving of Asset",
    description: "Input of additional info and Purchase Order Number",
    path: "/request/requisition-receiving",
  },
];

const AssetRequisition = () => {
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 590px)");
  // console.log(location.pathname);

  return (
    <>
      {location.pathname === "/asset-requisition" ? (
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
            Asset Requisition
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

export default AssetRequisition;
