import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import ErrorFetching from "../ErrorFetching";
import AddUnitApprovers from "./AddEdit/AddUnitApprovers";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import {
  openConfirm,
  closeConfirm,
  onLoading,
} from "../../Redux/StateManagement/confirmSlice";
import {
  useGetUnitApproversApiQuery,
  usePostUnitApproversStatusApiMutation,
  useDeleteUnitApproversApiMutation,
  useGetUnitApproversIdApiQuery,
} from "../../Redux/Query/Settings/UnitApprovers";

// MUI
import {
  Box,
  Button,
  Chip,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import { Help, Report, ReportProblem, Warning } from "@mui/icons-material";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import ViewTagged from "../../Components/Reusable/ViewTagged";
import {
  closeDrawer,
  openDrawer,
} from "../../Redux/StateManagement/booleanStateSlice";
// import AddUnitApprovers from "../Masterlist/AddEdit/Settings/AddUnitApprovers";

const UnitApprovers = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [updateUnitApprovers, setUpdateUnitApprovers] = useState({
    status: false,
    id: null,
    requester_id: null,
    approver_id: [],
  });

  const drawer = useSelector((state) => state.booleanState.drawer);

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
  const limitHandler = (e) => {
    setPage(1);
    setLimit(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const {
    data: unitApproversData,
    isLoading: unitApproversLoading,
    isSuccess: unitApproversSuccess,
    isError: unitApproversError,
    error: errorData,
    refetch,
  } = useGetUnitApproversApiQuery(
    {
      page: page,
      limit: limit,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  console.log(unitApproversData);

  // const {
  //   data: unitApproversIdApi,
  //   isLoading: unitApproversIdApiLoading,
  //   isSuccess: unitApproversIdApiSuccess,
  //   isFetching: unitApproversIdApiFetching,
  //   isError: unitApproversIdApiError,
  //   refetch: unitApproversIdApiRefetch,
  // } = useGetUnitApproversIdApiQuery();

  const [postUnitApproversStatusApi, { isLoading: isStatusLoading }] =
    usePostUnitApproversStatusApiMutation();

  const [deleteUnitApproversApi, { isLoading }] =
    useDeleteUnitApproversApiMutation();

  const dispatch = useDispatch();

  const onArchiveRestoreHandler = async (id, action = "update") => {
    dispatch(
      openConfirm({
        icon: status === "active" ? ReportProblem : Help,
        iconColor: status === "active" ? "alert" : "info",
        message: (
          <Box>
            <Typography> Are you sure you want to</Typography>
            <Typography
              sx={{
                display: "inline-block",
                color: "secondary.main",
                fontWeight: "bold",
                fontFamily: "Raleway",
              }}
            >
              {status === "active" ? "ARCHIVE" : "ACTIVATE"}
            </Typography>{" "}
            this data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const result = await postUnitApproversStatusApi({
              id: id,
              status: status === "active" ? false : true,
            }).unwrap();

            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );
            dispatch(closeConfirm());
          } catch (err) {
            if (err?.status === 422) {
              dispatch(
                openToast({
                  message: err.data.error,
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

  const onDeleteHandler = async (id) => {
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
              DELETE
            </Typography>{" "}
            this Data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result = await deleteUnitApproversApi(id).unwrap();
            console.log(result);
            setPage(1);
            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );
            dispatch(closeConfirm());
          } catch (err) {
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

  const onUpdateHandler = (props) => {
    const { id, requester_details, approvers } = props;
    setUpdateUnitApprovers({
      status: true,
      action: "update",
      id: id,
      requester_details: requester_details,
      approvers: approvers,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateUnitApprovers({
      status: false,
      id: null,
      requester_details: null,
      approvers: [],
    });
  };

  const onViewHandler = (props) => {
    const { id, requester_details, approvers } = props;
    setUpdateUnitApprovers({
      status: true,
      action: "view",
      id: id,
      requester_details: requester_details,
      approvers: approvers,
    });
  };

  const handleViewApprovers = (data) => {
    onViewHandler(data);
    dispatch(openDrawer());
    dispatch(closeConfirm());
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <>
      {unitApproversLoading && (
        <MasterlistSkeleton category={true} onAdd={true} />
      )}

      {unitApproversError && (
        <ErrorFetching
          refetch={refetch}
          category={unitApproversData}
          error={errorData}
        />
      )}

      {unitApproversData && !unitApproversError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar
              path="#"
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onSetPage={setPage}
              onAdd={() => {}}
              hideArchive={true}
            />

            <Box>
              <TableContainer className="mcontainer__th-body-category">
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
                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `requester_id`}
                          direction={orderBy === `requester_id` ? order : `asc`}
                          onClick={() => onSort(`requester_id`)}
                        >
                          ID No.
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `requester_name`}
                          direction={
                            orderBy === `requester_name` ? order : `asc`
                          }
                          onClick={() => onSort(`requester_name`)}
                        >
                          Requester
                        </TableSortLabel>
                      </TableCell>

                      <TableCell align="center" className="tbl-cell">
                        Approvers
                      </TableCell>

                      {/* <TableCell className="tbl-cell text-center">
                        Status
                      </TableCell> */}

                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `created_at`}
                          direction={orderBy === `created_at` ? order : `asc`}
                          onClick={() => onSort(`created_at`)}
                        >
                          Date Created
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">Action</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {unitApproversData?.data?.data?.length === 0 ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {unitApproversSuccess &&
                          [...unitApproversData?.data?.data]
                            ?.sort(comparator(order, orderBy))
                            ?.map((data, index) => (
                              <TableRow
                                key={index}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    borderBottom: 0,
                                  },
                                }}
                              >
                                <TableCell className="tbl-cell tr-cen-pad45">
                                  {data.id}
                                </TableCell>

                                <TableCell
                                  className="tbl-cell text-weight"
                                  sx={{
                                    textTransform: "capitalize",
                                  }}
                                >
                                  {`${data.requester_details?.firstname} ${data.requester_details?.lastname} `}
                                </TableCell>

                                <TableCell
                                  align="center"
                                  className="tbl-cell text-weight"
                                  sx={{
                                    textTransform: "capitalize",
                                  }}
                                >
                                  <Button
                                    sx={{
                                      textTransform: "capitalize",
                                      textDecoration: "underline",
                                    }}
                                    variant="text"
                                    size="small"
                                    color="link"
                                    onClick={() => handleViewApprovers(data)}
                                  >
                                    <Typography fontSize={13}>View</Typography>
                                  </Button>

                                  {/* {data?.approvers?.map((items) => {
                                      return `${items?.approver_details?.firstname} `;
                                    })} */}

                                  {/* <ViewTagged /> */}
                                </TableCell>

                                {/* <TableCell className="tbl-cell text-center">
                                  {data.status ? (
                                    <Chip
                                      size="small"
                                      variant="contained"
                                      sx={{
                                        background: "#27ff811f",
                                        color: "active.dark",
                                        fontSize: "0.7rem",
                                        px: 1,
                                      }}
                                      label="ACTIVE"
                                    />
                                  ) : (
                                    <Chip
                                      size="small"
                                      variant="contained"
                                      sx={{
                                        background: "#fc3e3e34",
                                        color: "error.light",
                                        fontSize: "0.7rem",
                                        px: 1,
                                      }}
                                      label="INACTIVE"
                                    />
                                  )}
                                </TableCell> */}

                                <TableCell className="tbl-cell tr-cen-pad45">
                                  {Moment(data.created_at).format(
                                    "MMM DD, YYYY"
                                  )}
                                </TableCell>

                                <TableCell className="tbl-cell ">
                                  <ActionMenu
                                    status={status}
                                    data={data}
                                    hideArchive={true}
                                    showDelete={true}
                                    onUpdateHandler={onUpdateHandler}
                                    onArchiveRestoreHandler={
                                      onArchiveRestoreHandler
                                    }
                                    onDeleteHandler={onDeleteHandler}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                      </>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            <Box className="mcontainer__pagination">
              <TablePagination
                rowsPerPageOptions={[
                  5,
                  10,
                  15,
                  {
                    label: "All",
                    value: parseInt(unitApproversData?.data?.total),
                  },
                ]}
                component="div"
                count={
                  unitApproversSuccess ? unitApproversData?.data?.total : 0
                }
                page={
                  unitApproversSuccess
                    ? unitApproversData?.data?.current_page - 1
                    : 0
                }
                rowsPerPage={
                  unitApproversSuccess
                    ? parseInt(unitApproversData?.data?.per_page)
                    : 5
                }
                onPageChange={pageHandler}
                onRowsPerPageChange={limitHandler}
              />
            </Box>
          </Box>
        </>
      )}

      <Dialog
        open={drawer}
        PaperProps={{
          sx: { borderRadius: "10px", maxWidth: "1200px" },
        }}
      >
        <AddUnitApprovers
          data={updateUnitApprovers}
          onUpdateResetHandler={onUpdateResetHandler}
        />
      </Dialog>

      {/* <Dialog
        open={dialog}
        onClose={() => dispatch(closeDialog())}
        PaperProps={{ sx: { borderRadius: "10px" } }}
      >
        <ViewTagged
          data={updateUnitApprovers}
          mapData={mapApproversData}
          setViewDepartment={setUpdateUnitApprovers}
          name="Approvers"
        />
      </Dialog> */}
    </>
  );
};

export default UnitApprovers;
