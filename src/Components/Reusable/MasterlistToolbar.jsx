import React, { useEffect, useState } from "react";
import "../../Style/Masterlist/masterlistToolbar.scss";
import ScanFixedAsset from "../../Pages/Masterlist/AddEdit/FixedAssetComponents/ScanFixedAsset";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
// import { openDrawer } from "../../Redux/StateManagement/drawerSlice";
// import { openDialog } from "../../Redux/StateManagement/dialogSlice";
// import { openImport } from "../../Redux/StateManagement/importFileSlice";
// import { openDatePicker } from "../../Redux/StateManagement/datePickerSlice";
// import { openScan } from "../../Redux/StateManagement/scanFileSlice";

import {
  openDrawer,
  openDialog,
  openAdd,
  openDatePicker,
  openImport,
  openDrawer1,
  openExport,
  openScan,
} from "../../Redux/StateManagement/booleanStateSlice";

import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  Divider,
  Fade,
  FormControlLabel,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
  Zoom,
  useMediaQuery,
} from "@mui/material";
import {
  AddCard,
  Archive,
  Filter,
  FilterList,
  LibraryAdd,
  PostAdd,
  Print,
  QrCodeScannerRounded,
  Sync,
  SystemUpdateAltRounded,
} from "@mui/icons-material";
// import BarcodeScannerComponent from "react-qr-barcode-scanner";

const MasterlistToolbar = (props) => {
  const {
    path = "",
    onStatusChange = () => {},
    onFaStatusChange = () => {},
    onSearchChange = () => {},
    onSetPage = () => {},
    onSyncHandler = () => {},
    scanAsset,
    onAdd,
    onPrint,
    onImport,
    onSync,
    hideArchive,
    faStatus,
  } = props;

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const openAddFa = Boolean(anchorEl);

  const [anchorElImport, setAnchorElImport] = useState(null);
  const openImportFa = Boolean(anchorElImport);

  const handleClose = () => {
    setAnchorEl(null) || setAnchorElImport(null);
  };

  // const scanFile = useSelector((state) => state.scanFile);

  const permissions = useSelector(
    (state) => state.userLogin?.user.role.access_permission
  );

  const isSmallScreen = useMediaQuery("(max-width: 500px)");

  const searchHandler = (e) => {
    if (e.key === "Enter") {
      onSearchChange(e.target.value);
      onSetPage(1);
    }
  };

  const statusHandler = (e) => {
    // console.log(e.target.checked);

    if (e.target.checked) {
      onSetPage(1);
      return onStatusChange("deactivated");
    }
    onSetPage(1);
    return onStatusChange("active");
  };

  // const faStatusHandler = (e) => {
  //   if (e.target.checked) {
  //     onSetPage(1);
  //     return onFaStatusChange("Disposed");
  //   }
  //   onSetPage(1);
  //   return onFaStatusChange(
  //     "Good, For Disposal, For Repair, Spare, Write Off, Sold"
  //   );
  // };

  const syncHandler = () => {
    onSyncHandler();
  };

  const handleOpenDatePicker = () => {
    dispatch(openDatePicker());
  };

  const handleOpenDrawer = (e) => {
    if (!faStatus) {
      dispatch(openDrawer());
    }
    setAnchorEl(e.currentTarget);
  };

  const handleOpenDialog = () => {
    dispatch(openDialog());
  };

  const handleOpenAddFA = (e) => {
    dispatch(openDrawer());
    setAnchorEl(!e.currentTarget);
  };
  const handleOpenAddCost = (e) => {
    dispatch(openAdd());
    setAnchorEl(!e.currentTarget);
  };

  const handleOpenImport = (e) => {
    if (!faStatus) {
      dispatch(openImport());
    }
    setAnchorElImport(e.currentTarget);
  };

  const handleOpenImportFA = (e) => {
    dispatch(openImport());
    setAnchorElImport(!e.currentTarget);
  };
  const handleOpenImportCost = (e) => {
    dispatch(openDrawer1());
    setAnchorElImport(!e.currentTarget);
  };

  const handleScan = () => {
    dispatch(openScan());
  };

  return (
    <Box className="masterlist-toolbar">
      <Box className="masterlist-toolbar__container">
        {!hideArchive && (
          <Box>
            <FormControlLabel
              control={<Checkbox size="small" onClick={statusHandler} />}
              label={
                isSmallScreen ? <Archive sx={{ mt: "5px" }} /> : "ARCHIVED"
              }
            />
          </Box>
        )}

        {scanAsset && (
          // <Stack
          //   flexDirection="row"
          //   alignItems="center"
          //   gap={1}
          //   sx={{ cursor: "pointer" }}
          //   onClick={handleScan}
          // >
          //   <IconButton
          //     variant="contained"
          //     size="small"
          //     sx={{ height: "30px" }}
          //     onClick={handleScan}
          //   >
          //     <QrCodeScannerRounded />
          //   </IconButton>
          //   {isSmallScreen ? null : (
          //     <Typography fontFamily="Anton, Poppins, Roboto, Arial">
          //       Scan
          //     </Typography>
          //   )}
          // </Stack>

          <Button
            onClick={handleScan}
            startIcon={
              isSmallScreen ? null : <QrCodeScannerRounded color="primary" />
            }
            color="secondary"
            variant="contained"
            size="small"
            sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
          >
            {isSmallScreen ? (
              <QrCodeScannerRounded color="primary" sx={{ fontSize: "20px" }} />
            ) : (
              <Typography>Scan</Typography>
            )}
          </Button>
        )}

        <Box className="masterlist-toolbar__addBtn">
          {Boolean(onPrint) &&
            permissions?.split(", ").includes("print-fa") && (
              <Button
                component={Link}
                variant="outlined"
                to={path}
                onClick={handleOpenDatePicker}
                startIcon={isSmallScreen ? null : <Print color="secondary" />}
                size="small"
                color="secondary"
                sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
              >
                {isSmallScreen ? (
                  <Print color="secondary" sx={{ fontSize: "20px" }} />
                ) : (
                  "Print"
                )}
              </Button>
            )}

          {Boolean(onImport) && (
            <LoadingButton
              component={Link}
              to={path}
              onClick={handleOpenImport}
              variant="contained"
              startIcon={
                isSmallScreen ? null : (
                  <SystemUpdateAltRounded
                    color="primary"
                    sx={{ fontSize: "20px" }}
                  />
                )
              }
              size="small"
              color="secondary"
              sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
            >
              {isSmallScreen ? (
                <SystemUpdateAltRounded
                  color="primary"
                  sx={{ fontSize: "20px" }}
                />
              ) : (
                "Import"
              )}
            </LoadingButton>
          )}

          {faStatus && (
            <Menu
              anchorEl={anchorElImport}
              open={openImportFa}
              onClose={handleClose}
              TransitionComponent={Fade}
              disablePortal
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleOpenImportFA} dense>
                <ListItemIcon>
                  <PostAdd />
                </ListItemIcon>
                <ListItemText>Import Fixed Asset</ListItemText>
              </MenuItem>

              <Divider sx={{ mx: 2 }} />

              <MenuItem onClick={handleOpenImportCost} dense>
                <ListItemIcon>
                  <AddCard />
                </ListItemIcon>
                <ListItemText>Import Additional Cost</ListItemText>
              </MenuItem>
            </Menu>
          )}

          {Boolean(onAdd) && (
            <Button
              component={Link}
              to={path}
              onClick={handleOpenDrawer || handleOpenDialog}
              variant="contained"
              startIcon={isSmallScreen ? null : <LibraryAdd />}
              size="small"
              sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
            >
              {isSmallScreen ? (
                <LibraryAdd color="black" sx={{ fontSize: "20px" }} />
              ) : (
                "Add"
              )}
            </Button>
          )}

          {faStatus && (
            <Menu
              anchorEl={anchorEl}
              open={openAddFa}
              onClose={handleClose}
              TransitionComponent={Fade}
              disablePortal
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleOpenAddFA} dense>
                <ListItemIcon>
                  <PostAdd />
                </ListItemIcon>
                <ListItemText>Add Fixed Asset</ListItemText>
              </MenuItem>

              <Divider sx={{ mx: 2 }} />

              <MenuItem onClick={handleOpenAddCost} dense>
                <ListItemIcon>
                  <AddCard />
                </ListItemIcon>
                <ListItemText>Add Additional Cost</ListItemText>
              </MenuItem>
            </Menu>
          )}

          {Boolean(onSync) && (
            <LoadingButton
              component={Link}
              to={path}
              onClick={syncHandler}
              variant="contained"
              startIcon={
                isSmallScreen ? null : <Sync sx={{ color: "primary.main" }} />
              }
              size="small"
              color="secondary"
              sx={isSmallScreen ? { minWidth: "50px", px: 0 } : null}
            >
              {isSmallScreen ? (
                <Sync sx={{ color: "primary.main" }} />
              ) : (
                "Sync Data"
              )}
            </LoadingButton>
          )}
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            // flexWrap: "wrap",
          }}
        >
          {/* {faStatus && (
            <Stack
              flexDirection="row"
              alignItems="center"
              gap={1}
              sx={{ cursor: "pointer" }}
              onClick={handleScan}
            >
              <Tooltip
                title="Scan Asset"
                TransitionComponent={Zoom}
                placement="top"
                arrow
              >
                <IconButton
                  variant="contained"
                  size="small"
                  sx={{ height: "30px" }}
                  onClick={handleScan}
                >
                  <QrCodeScannerRounded />
                </IconButton>
                 {isSmallScreen ? null : <Typography>Scan Asset</Typography>} 
              </Tooltip>
            </Stack>
          )}*/}

          {faStatus && (
            <Tooltip
              title="Filter"
              TransitionComponent={Zoom}
              placement="top"
              arrow
            >
              <IconButton>
                <FilterList />
              </IconButton>
            </Tooltip>
          )}

          <TextField
            autoComplete="off"
            variant="outlined"
            name="search"
            label="🔍︎ Search"
            // label="🔍 Search"
            type="text"
            size="small"
            color="secondary"
            sx={{
              ".MuiInputBase-root": {
                borderRadius: "15px",
                border: ".5px",
                background: "#f4f4f4",
                width: "100%",
                minWidth: "100px",
              },
            }}
            onKeyDown={searchHandler}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MasterlistToolbar;
