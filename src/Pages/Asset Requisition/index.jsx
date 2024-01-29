import React from "react";
import "../../Style/parentSidebar.scss";
import bgImage from "../../Img/CardBG.svg";

import { Outlet } from "react-router";
import { useLocation } from "react-router-dom";

import { Box, Typography, useMediaQuery } from "@mui/material";
import { AssignmentTurnedIn, OpenInBrowserOutlined, Output, ShoppingBasket } from "@mui/icons-material";
import Cards from "../../Components/Reusable/Cards";
import { useSelector } from "react-redux";

const RequestList = [
  {
    icon: <AssignmentTurnedIn />,
    label: "Requisition",
    description: "Requesting of Fixed Assets",
    path: "/asset-requisition/requisition",
    permission: "requisition",
  },

  {
    icon: <ShoppingBasket />,
    label: "Purchase Request",
    description: "Matching of Purchase Request",
    path: "/asset-requisition/purchase-request",
    permission: "purchase-request",
  },

  {
    icon: <OpenInBrowserOutlined />,
    label: "Receiving of Asset",
    description: "Input of additional info and Purchase Order Number",
    path: "/asset-requisition/requisition-receiving",
    permission: "requisition-receiving",
  },

  {
    icon: <Output />,
    label: "Releasing of Asset",
    description: "Release the Asset to the End User",
    path: "/asset-requisition/requisition-releasing",
    permission: "requisition-releasing",
  },
];

const AssetRequisition = () => {
  const location = useLocation();
  const isSmallScreen = useMediaQuery("(max-width: 590px)");
  // console.log(location.pathname);

  const permissions = useSelector((state) => state.userLogin?.user.role.access_permission);

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
                  return permissions.split(", ").includes(data.permission) && <Cards data={data} key={index} />;
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
