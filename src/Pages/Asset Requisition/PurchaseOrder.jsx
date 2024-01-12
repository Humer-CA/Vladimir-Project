import React, { useState } from "react";
import { TabContext, TabPanel } from "@mui/lab";
import { Box, Tab, Tabs, Typography } from "@mui/material";

import PurchaseRequestTable from "./PurchaseRequestTable";

const PurchaseRequest = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "1.6rem" }}>
        Purchase Request
      </Typography>

      <Box>
        <TabContext value={value}>
          <Tabs onChange={handleChange} value={value}>
            <Tab label="Without PR No." value="1" className={value === "1" ? "tab__background" : null} />

            <Tab label="With PR No." value="2" className={value === "2" ? "tab__background" : null} />
          </Tabs>

          <TabPanel sx={{ p: 0 }} value="1" index="1">
            <PurchaseRequestTable />
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value="2" index="2">
            <PurchaseRequestTable withPr />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default PurchaseRequest;
