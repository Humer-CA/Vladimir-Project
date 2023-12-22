import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import ErrorFetching from "../ErrorFetching";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import {
  openConfirm,
  closeConfirm,
  onLoading,
} from "../../Redux/StateManagement/confirmSlice";
import {
  useGetByTransactionApiQuery,
  useGetRequisitionApiQuery,
  useGetRequisitionMonitoringApiQuery,
  useLazyGetRequisitionAllApiQuery,
  usePatchRequisitionStatusApiMutation,
  useVoidRequisitionApiMutation,
} from "../../Redux/Query/Request/Requisition";

// MUI
import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import {
  Help,
  IosShareRounded,
  LibraryAdd,
  Report,
  ReportProblem,
  Visibility,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import ProcessDetails from "../Approving/ProcessDetails";
import { closeDialog, openDialog } from "../../Redux/StateManagement/booleanStateSlice";
import RequestTimeline from "./RequestTimeline";
import useExcel from "../../Hooks/Xlsx";
import moment from "moment";

const RequestMonitoring = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [urlPath, setUrlPath] = useState(true);
  const [transactionIdData, setTransactionIdData] = useState();

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 500px)");
  const drawer = useSelector((state) => state.booleanState.drawer);
  const dialog = useSelector((state) => state.booleanState.dialog);

  const { excelExport } = useExcel();

  // Table Sorting --------------------------------

  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const comparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const onSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Table Properties --------------------------------
  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const [requestDataTrigger] = useLazyGetRequisitionAllApiQuery();

  const {
    data: requisitionData,
    isLoading: requisitionLoading,
    isSuccess: requisitionSuccess,
    isError: requisitionError,
    error: errorData,
    refetch,
  } = useGetRequisitionMonitoringApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [postRequisitionStatusApi, { isLoading }] =
    usePatchRequisitionStatusApiMutation();

  const [voidRequisitionApi, { isVoidLoading }] =
    useVoidRequisitionApiMutation();

  const dispatch = useDispatch();

  const onVoidHandler = async (id) => {
    dispatch(
      openConfirm({
        icon: Report,
        iconColor: "warning",
        message: (
          <Box>
            <Typography> Are you sure you want to</Typography>
            <Typography
              sx={{
                display: "inline-block",
                color: "secondary.main",
                fontWeight: "bold",
              }}
            >
              VOID
            </Typography>{" "}
            this Data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result = await voidRequisitionApi({
              id: id,
              transaction_number: id,
            }).unwrap();

            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );

            dispatch(closeConfirm());
          } catch (err) {
            console.log(err);
            if (err?.status === 422) {
              dispatch(
                openToast({
                  message: err.data.message,
                  duration: 5000,
                  variant: "error",
                })
              );
            } else if (err?.status !== 422) {
              dispatch(
                openToast({
                  message: "Something went wrong. Please try again.",
                  duration: 5000,
                  variant: "error",
                })
              );
            }
          }
        },
      })
    );
  };

  const onSetPage = () => {
    setPage(1);
  };

  const handleViewTimeline = (data) => {
    dispatch(openDialog());
    setTransactionIdData(data)
  };

  const handleExport = async () => {
    try {
      const res = await requestDataTrigger().unwrap();
      const newObj = res.map((item) => {
        return {
          // ID: item?.id,
          "Transaction No.": item?.transaction_number,
          "Acuisition Details": item?.acquisition_details,
          "Quantity of PR": item?.item_count,
          Status: item?.status,
          "Current Approver": `${item?.current_approver?.firstname} ${item?.current_approver?.lastname}`,
          "Created At": moment(item?.created_at).format("MMM DD, YYYY"),
        };
      });

      await excelExport(newObj, "Vladimir-Request.xlsx");
    } catch (err) {
      if (err?.status === 422) {
        dispatch(
          openToast({
            message: err.data.errors?.detail,
            duration: 5000,
            variant: "error",
          })
        );
      } else if (err?.status !== 422) {
        dispatch(
          openToast({
            message: "Something went wrong. Please try again.",
            duration: 5000,
            variant: "error",
          })
        );
      }
    }
  };




  const handleEditRequisition = (data) => {
    navigate(
      `/request-monitoring/${data.transaction_number}`,
      {
        state: { ...data },
      },
    );
  };

  return (
    <Box className="mcontainer">
      <Typography
        className="mcontainer__title"
        sx={{ fontFamily: "Anton", fontSize: "2rem" }}
      >
        Request Monitoring
      </Typography>
      {requisitionLoading && <MasterlistSkeleton onAdd={true} />}
      {requisitionError && (
        <ErrorFetching refetch={refetch} error={errorData} />
      )}
      {requisitionData && !requisitionError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onSetPage={setPage}
              request
              hideArchive
            />
            {/* 
            <Box className="masterlist-toolbar__addBtn" sx={{ mt: 0.25 }}>
              <Button
                onClick={handleAddRequisition}
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
            </Box> */}

            <Box>
              <TableContainer className="mcontainer__th-body">
                <Table className="mcontainer__table" stickyHeader>
                  <TableHead>
                    <TableRow
                      sx={{
                        "& > *": {
                          fontWeight: "bold!important",
                          whiteSpace: "nowrap",
                        },
                      }}
                    >
                      {/* <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `id`}
                          direction={orderBy === `id` ? order : `asc`}
                          onClick={() => onSort(`id`)}
                        >
                          ID No.
                        </TableSortLabel>
                      </TableCell> */}

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `transaction_number`}
                          direction={
                            orderBy === `transaction_number` ? order : `asc`
                          }
                          onClick={() => onSort(`transaction_number`)}
                        >
                          Transaction No.
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `acquisition_details`}
                          direction={
                            orderBy === `acquisition_details` ? order : `asc`
                          }
                          onClick={() => onSort(`acquisition_details`)}
                        >
                          Acquisition Details
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `item_count`}
                          direction={
                            orderBy === `item_count` ? order : `asc`
                          }
                          onClick={() => onSort(`item_count`)}
                        >
                          Quantity of PR
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">
                        View Information
                      </TableCell>

                      <TableCell className="tbl-cell" align="center">
                        <TableSortLabel
                          active={orderBy === `status`}
                          direction={
                            orderBy === `status` ? order : `asc`
                          }
                          onClick={() => onSort(`status`)}
                        >
                          View Status
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `created_at`}
                          direction={orderBy === `created_at` ? order : `asc`}
                          onClick={() => onSort(`created_at`)}
                        >
                          Date Created
                        </TableSortLabel>
                      </TableCell>

                      {/* <TableCell className="tbl-cell">Action</TableCell> */}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {requisitionData?.data?.length === 0 ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {requisitionSuccess &&
                          [...requisitionData?.data]
                            ?.sort(comparator(order, orderBy))
                            ?.map((data) => (
                              <TableRow
                                key={data.id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    borderBottom: 0,
                                  },
                                }}
                              >
                                {/* <TableCell className="tbl-cell tr-cen-pad45">
                                  {data.id}
                                </TableCell> */}
                                <TableCell className="tbl-cell text-weight">
                                  {data.transaction_number}
                                </TableCell>
                                <TableCell className="tbl-cell">
                                  {data.acquisition_details}
                                </TableCell>
                                <TableCell className="tbl-cell text-weight tr-cen-pad45">
                                  {data.item_count}
                                </TableCell>
                                <TableCell className="tbl-cell text-weight text-center">
                                  <Tooltip
                                    placement="top"
                                    title="View Request Information"
                                    arrow
                                  >
                                    <IconButton
                                      onClick={() =>
                                        handleEditRequisition(data)
                                      }
                                    >
                                      <Visibility />
                                    </IconButton>
                                  </Tooltip>
                                </TableCell>
                                <TableCell className="tbl-cell tr-cen-pad45">
                                  {data.status !== "Returned" ? (
                                    <Tooltip
                                      placement="top"
                                      title={`${data?.current_approver?.firstname} 
                                        ${data?.current_approver?.lastname}`}
                                      arrow
                                    >
                                      <Chip onClick={() => handleViewTimeline(data)}
                                        size="small"
                                        variant={data.status === "Approved" ? "filled" : "outlined"}
                                        sx={{
                                          borderColor: "active.dark",
                                          color: data?.status === "Approved" ? "white" : "active.dark",
                                          fontSize: "0.7rem",
                                          px: 1,
                                          cursor: "pointer",
                                          backgroundColor: data?.status === "Approved" && "success.main",
                                          ":hover": { backgroundColor: data?.status === "Approved" ? "success.dark" : "red" }
                                        }}
                                        label={`${data.status}`}
                                      />
                                    </Tooltip>
                                  ) : (
                                    <Chip
                                      placement="top"
                                      onClick={() => handleViewTimeline(data)}
                                      size="small"
                                      variant="filled"
                                      sx={{
                                        backgroundColor: "error.light",
                                        // borderColor: "#fc3e3e34",
                                        // color: "error.light",
                                        color: "white",
                                        fontSize: "0.7rem",
                                        px: 1,
                                        ":hover": { backgroundColor: "error.dark" }
                                      }}
                                      label={`${data.status}`}
                                    />
                                  )}
                                </TableCell>
                                <TableCell className="tbl-cell tr-cen-pad45">
                                  {Moment(data.created_at).format(
                                    "MMM DD, YYYY"
                                  )}
                                </TableCell>
                                {/* <TableCell className="tbl-cell ">
                                  <ActionMenu
                                    status={data.status}
                                    data={data}
                                    hideArchive
                                    showVoid
                                    onVoidHandler={onVoidHandler}
                                  />
                                </TableCell> */}
                              </TableRow>
                            ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
            <Box className="mcontainer__pagination-export">
              <Button
                className="mcontainer__export"
                variant="outlined"
                size="small"
                color="text"
                startIcon={<IosShareRounded color="primary" />}
                onClick={handleExport}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "10px 20px",
                }}
              >
                EXPORT
              </Button>
              <CustomTablePagination
                total={requisitionData?.total}
                success={requisitionSuccess}
                current_page={requisitionData?.current_page}
                per_page={requisitionData?.per_page}
                onPageChange={pageHandler}
                onRowsPerPageChange={perPageHandler}
              />
            </Box>
          </Box>
        </>
      )}
      <Dialog
        open={dialog}
        onClose={() => dispatch(closeDialog())}
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <RequestTimeline
          data={transactionIdData}
        />
      </Dialog>
    </Box>
  );
};

export default RequestMonitoring;
