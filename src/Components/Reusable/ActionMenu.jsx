import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";

import { useDispatch } from "react-redux";
import {
  openDialog,
  openDrawer,
} from "../../Redux/StateManagement/booleanStateSlice";

import {
  Box,
  IconButton,
  MenuItem,
  Menu,
  Fade,
  Divider,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import {
  MoreVert,
  BorderColor,
  MoveToInbox,
  RestartAlt,
  Reply,
  AddCircleOutline,
  RemoveCircleOutline,
  Delete,
  DoneOutline,
  DoNotDisturb,
} from "@mui/icons-material";

const ActionMenu = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [remarks, setRemarks] = useState("");
  // const { state: dataFA } = useLocation();

  const {
    data,
    onArchiveRestoreHandler,
    onApprovalStatusHandler,
    onSubCapexArchiveRestoreHandler,
    onDisposedRestoreHandler,
    onResetHandler,
    onUpdateHandler,
    onDeleteHandler,
    status,
    faStatus,
    setSubCapexDialog,
    // onAddMinorCategoryHandler,
    openCollapse,
    hideEdit,
    hideArchive,
    showDelete,
    showApprover,
  } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleArchiveRestore = () => {
    // console.log(data?.id, status);
    onArchiveRestoreHandler(data?.id, status);
    handleClose();
  };

  const handleApprovalStatus = () => {
    // console.log(data?.id, status);
    onApprovalStatusHandler(data?.id, status);
    handleClose();
  };

  const handleDelete = () => {
    onDeleteHandler(data?.id);
    handleClose();
  };

  // const handleDisposedRestore = () => {
  //   onDisposedRestoreHandler(data?.id);
  //   handleClose();
  // };

  const handleRestoreFA = () => {
    onDisposedRestoreHandler(data?.id);
    handleClose();
  };

  const handleReset = () => {
    onResetHandler(data?.id);
    handleClose();
  };

  const handleEdit = () => {
    // console.log(data);
    onUpdateHandler(data);
    dispatch(openDrawer());
    dispatch(openDialog());
    handleClose();
  };

  const handleSubCapexEdit = () => {
    onUpdateHandler(data);
    setSubCapexDialog(true);
    handleClose();
  };

  // const handleAddMinorCategory = () => {
  //   onAddMinorCategoryHandler(data);
  //   dispatch(openDrawer());
  //   handleClose();
  // };

  return (
    <Box>
      <IconButton onClick={handleOpen}>
        <MoreVert sx={openCollapse ? { color: "white" } : null} />
      </IconButton>
      {status ? (
        <Menu
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          disablePortal
        >
          {status === "active" && !hideEdit && (
            <MenuItem onClick={handleEdit} dense>
              <ListItemIcon>
                <BorderColor />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Edit
              </ListItemText>
            </MenuItem>
          )}

          {setSubCapexDialog && status === "active" && (
            <MenuItem onClick={handleSubCapexEdit} dense>
              <ListItemIcon>
                <BorderColor />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Edit
              </ListItemText>
            </MenuItem>
          )}

          {!hideArchive && (
            <MenuItem onClick={handleArchiveRestore} dense>
              <ListItemIcon>
                {status === "active" ? <MoveToInbox /> : <Reply />}
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                {status === "active" ? "Archive" : "Restore"}
              </ListItemText>
            </MenuItem>
          )}

          {showDelete && (
            <MenuItem onClick={handleDelete} dense>
              <ListItemIcon>
                <Delete />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Delete
              </ListItemText>
            </MenuItem>
          )}

          {status === "active" && onResetHandler !== undefined && (
            <MenuItem onClick={handleReset} dense>
              <ListItemIcon>
                <RestartAlt />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Reset
              </ListItemText>
            </MenuItem>
          )}
        </Menu>
      ) : (
        // Fixed Asset
        <Menu
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          disablePortal
        >
          {faStatus !== "Disposed" && (
            <MenuItem onClick={handleEdit} dense>
              <ListItemIcon>
                <BorderColor />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Edit
              </ListItemText>
            </MenuItem>
          )}

          {/* {handleDisposedRestore && (
            <MenuItem onClick={handleDisposedRestore} dense>
              <ListItemIcon>
                {faStatus === "Disposed" ? <Reply /> : <RemoveCircleOutline />}
              </ListItemIcon>
              <ListItemText
                disableTypography
                align="left"
                onClick={handleRestoreFA}
              >
                {faStatus === "Disposed" ? "Restore" : "Dispose"}
              </ListItemText>
            </MenuItem>
          )} */}
        </Menu>
      )}

      {showApprover && (
        <Menu
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          TransitionComponent={Fade}
          disablePortal
        >
          <MenuItem onClick={onApprovalStatusHandler} dense>
            <ListItemIcon>
              <DoneOutline />
            </ListItemIcon>
            <ListItemText disableTypography align="left">
              Approve
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={onDeleteHandler} dense>
            <ListItemIcon>
              <DoNotDisturb />
            </ListItemIcon>
            <ListItemText disableTypography align="left">
              Return
            </ListItemText>
          </MenuItem>
        </Menu>
      )}
    </Box>
  );
};

export default ActionMenu;
