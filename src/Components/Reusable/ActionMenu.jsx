import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router";

import { useDispatch } from "react-redux";
import { openDialog, openDrawer } from "../../Redux/StateManagement/booleanStateSlice";

import { Box, IconButton, MenuItem, Menu, Fade, Divider, ListItemIcon, ListItemText, Button } from "@mui/material";
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
  Cancel,
} from "@mui/icons-material";

const ActionMenu = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [remarks, setRemarks] = useState("");
  // const { state: dataFA } = useLocation();

  const {
    data,
    onArchiveRestoreHandler,
    onApprovalApproveHandler,
    onSubCapexArchiveRestoreHandler,
    onApprovalReturnHandler,
    onDisposedRestoreHandler,
    onResetHandler,
    onUpdateHandler,
    onDeleteHandler,
    onVoidHandler,
    status,
    faStatus,
    setSubCapexDialog,
    // onAddMinorCategoryHandler,
    openCollapse,
    hideEdit,
    hideArchive,
    showEditNav,
    showDelete,
    showVoid,
    showApprover,
    editRequest,
    onVoidReferenceHandler,
    setShowEdit
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
    onArchiveRestoreHandler(data?.id, status);
    handleClose();
  };

  const handleApprovalStatus = () => {
    onApprovalApproveHandler(data?.id, status);
    handleClose();
  };

  const handleReturnStatus = () => {
    onApprovalReturnHandler(data?.id, status);
    handleClose();
  };

  const handleDelete = () => {
    // console.log(data)
    onDeleteHandler(data?.id || data?.subunit?.id)
    handleClose();
  };

  const handleVoid = () => {
    onVoidHandler(data?.transaction_number);
    handleClose();
  };

  const handleVoidReference = () => {
    onVoidReferenceHandler({ transaction_number: data?.transaction_number, reference_number: data?.reference_number });
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
    dispatch(openDrawer() || openDialog())
    handleClose();
  };

  const handleEditRequest = () => {
    // console.log(data);
    onUpdateHandler(data);
    handleClose();
    setShowEdit(true);
  };

  const handleEditNav = () => {
    navigate(`add-requisition`);
    onUpdateHandler(data);
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
            <MenuItem onClick={!showEditNav ? handleEdit : handleEditNav} dense>
              <ListItemIcon>
                <BorderColor />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Edit
              </ListItemText>
            </MenuItem>
          )}
          {editRequest && (
            <MenuItem onClick={handleEditRequest} dense>
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
              <ListItemIcon>{status === "active" ? <MoveToInbox /> : <Reply />}</ListItemIcon>
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

          {showVoid && (
            <MenuItem onClick={handleVoid} dense>
              <ListItemIcon>
                <Cancel />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Void
              </ListItemText>
            </MenuItem>
          )}

          {onVoidReferenceHandler && (
            <MenuItem onClick={handleVoidReference} dense>
              <ListItemIcon>
                <Cancel />
              </ListItemIcon>
              <ListItemText disableTypography align="left">
                Void
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
          <MenuItem onClick={handleApprovalStatus} dense>
            <ListItemIcon>
              <DoneOutline />
            </ListItemIcon>
            <ListItemText disableTypography align="left">
              Approve
            </ListItemText>
          </MenuItem>

          <MenuItem onClick={handleReturnStatus} dense>
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
