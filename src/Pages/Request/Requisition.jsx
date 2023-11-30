import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import ErrorFetching from "../ErrorFetching";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";
import AddRequisition from "./Add Requisition/AddRequisition";

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
  LibraryAdd,
  Report,
  ReportProblem,
  Visibility,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import ProcessDetails from "../Approving/ProcessDetails";

const Requisition = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [updateRequisition, setUpdateRequisition] = useState({
    status: false,
    id: null,
    // type_of_request_name: "",
  });

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 500px)");
  const drawer = useSelector((state) => state.booleanState.drawer);
  const dialog = useSelector((state) => state.booleanState.dialog);

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

  const handleEditRequisition = (data) => {
    navigate(
      `/request/requisition/add-requisition/${data.transaction_number}`,
      {
        state: { ...data },
      }
    );
  };

  // const handleViewProcessDetails = () => {
  //   dispatch(openDrawer());
  // };

  // console.log(requisitionData);

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
              hideArchive
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

                      <TableCell className="tbl-cell text-center">
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

                      <TableCell className="tbl-cell text-center">
                        View
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
                                  {data.transaction_number}
                                </TableCell>
                                <TableCell className="tbl-cell text-weight tr-cen-pad45">
                                  {data.item_count}
                                </TableCell>
                                <TableCell className="tbl-cell text-weight text-center">
                                  <Tooltip
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
                                <TableCell className="tbl-cell text-center">
                                  {data.status !== "Returned" ? (
                                    <Tooltip
                                      title={`${data?.current_approver?.firstname} 
                                        ${data?.current_approver?.lastname}`}
                                      arrow
                                    >
                                      <Chip
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          borderColor: "active.dark",
                                          color: "active.dark",
                                          fontSize: "0.7rem",
                                          px: 1,
                                        }}
                                        label={`${data.status}`}
                                      />
                                    </Tooltip>
                                  ) : (
                                    <Chip
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        // background: "#fc3e3e34",
                                        borderColor: "#fc3e3e34",
                                        color: "error.light",
                                        fontSize: "0.7rem",
                                        px: 1,
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
                                <TableCell className="tbl-cell ">
                                  <ActionMenu
                                    status={data.status}
                                    data={data}
                                    hideArchive
                                    showVoid
                                    onVoidHandler={onVoidHandler}
                                    onUpdateHandler={onUpdateHandler}
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
    </Box>
  );
};

export default Requisition;
