import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import ErrorFetching from "../ErrorFetching";
// import AddRequisition from "./AddEdit/AddRequisition";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../Layout/NoRecordsFound";
// import AddRequisition from "../Masterlist/AddEdit/AddRequisition";
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";
import AddRequisition from "./AddEdit/AddRequisition";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import {
  openConfirm,
  closeConfirm,
  onLoading,
} from "../../Redux/StateManagement/confirmSlice";
import {
  useGetRequisitionApiQuery,
  usePostRequisitionStatusApiMutation,
} from "../../Redux/Query/Request/Requisition";

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
  useMediaQuery,
} from "@mui/material";
import { Help, LibraryAdd, ReportProblem } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";

const Requisition = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setperPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateRequisition, setUpdateRequisition] = useState({
    status: false,
    id: null,
    // type_of_request_name: "",
  });

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 500px)");
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
  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const {
    data: requisitionData,
    isLoading: requisitionLoading,
    isSuccess: requisitionSuccess,
    isError: requisitionError,
    error: errorData,
    refetch,
  } = useGetRequisitionApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [postRequisitionStatusApi, { isLoading }] =
    usePostRequisitionStatusApiMutation();

  const dispatch = useDispatch();

  const onArchiveRestoreHandler = async (id) => {
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
            const result = await postRequisitionStatusApi({
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

  const onUpdateHandler = (props) => {
    const { id } = props;
    setUpdateRequisition({
      status: true,
      id: id,
      // type_of_request_name: type_of_request_name,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateRequisition({
      status: false,
      id: null,
      // type_of_request_name: "",
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  const handleAddRequisition = () => {
    navigate(`add-requisition`);
  };

  console.log(requisitionData);

  return (
    <Box className="mcontainer">
      <Typography
        className="mcontainer__title"
        sx={{ fontFamily: "Anton", fontSize: "2rem" }}
      >
        Requisition
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
              // onAdd={() => {}}
            />

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
            </Box>

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
                      <TableCell className="tbl-cell text-center">
                        <TableSortLabel
                          active={orderBy === `id`}
                          direction={orderBy === `id` ? order : `asc`}
                          onClick={() => onSort(`id`)}
                        >
                          ID No.
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                        // active={orderBy === `type_of_request_name`}
                        // direction={
                        //   orderBy === `type_of_request_name` ? order : `asc`
                        // }
                        // onClick={() => onSort(`type_of_request_name`)}
                        >
                          Transaction No.
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                        // active={orderBy === `type_of_request_name`}
                        // direction={
                        //   orderBy === `type_of_request_name` ? order : `asc`
                        // }
                        // onClick={() => onSort(`type_of_request_name`)}
                        >
                          Quantity of PO
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell">
                        <TableSortLabel
                        // active={orderBy === `type_of_request_name`}
                        // direction={
                        //   orderBy === `type_of_request_name` ? order : `asc`
                        // }
                        // onClick={() => onSort(`type_of_request_name`)}
                        >
                          View
                        </TableSortLabel>
                      </TableCell>

                      <TableCell className="tbl-cell text-center">
                        Status
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

                      <TableCell className="tbl-cell">Action</TableCell>
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
                                <TableCell className="tbl-cell tr-cen-pad45">
                                  {data.id}
                                </TableCell>

                                <TableCell className="tbl-cell text-weight">
                                  {/* {data.type_of_request_name} */}
                                </TableCell>

                                <TableCell className="tbl-cell text-center">
                                  {data.is_active ? (
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
                                </TableCell>

                                <TableCell className="tbl-cell tr-cen-pad45">
                                  {Moment(data.created_at).format(
                                    "MMM DD, YYYY"
                                  )}
                                </TableCell>

                                <TableCell className="tbl-cell ">
                                  <ActionMenu
                                    status={status}
                                    data={data}
                                    onUpdateHandler={onUpdateHandler}
                                    onArchiveRestoreHandler={
                                      onArchiveRestoreHandler
                                    }
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

            <CustomTablePagination
              total={requisitionData?.total}
              success={requisitionSuccess}
              current_page={requisitionData?.current_page}
              per_page={requisitionData?.per_page}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </>
      )}
      <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddRequisition
          data={updateRequisition}
          onUpdateResetHandler={onUpdateResetHandler}
        />
      </Dialog>
    </Box>
  );
};

export default Requisition;
