import React, { useState } from "react";
import { TabContext, TabPanel } from "@mui/lab";
import { Box, Button, Tab, Tabs, Typography } from "@mui/material";

import ReleasingTable from "./ReleasingTable";

const ReleasingOfAsset = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "1.6rem" }}>
        Releasing of Asset
      </Typography>

      <Box>
        <TabContext value={value}>
          <Tabs onChange={handleChange} value={value}>
            <Tab label="For Releasing" value="1" className={value === "1" ? "tab__background" : null} />

            <Tab label="Released" value="2" className={value === "2" ? "tab__background" : null} />
          </Tabs>

          <TabPanel sx={{ p: 0 }} value="1" index="1">
            <ReleasingTable />
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value="2" index="2">
            <ReleasingTable released />
          </TabPanel>
        </TabContext>
      </Box>
    </Box>
  );
};

export default ReleasingOfAsset;
