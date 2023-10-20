import React, { useState } from "react";

import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../ErrorFetching";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import AddSubUnit from "./AddEdit/AddSubUnit";
import ActionMenu from "../../Components/Reusable/ActionMenu";

import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import { useGetSubUnitApiQuery } from "../../Redux/Query/Masterlist/SubUnit";
import {
  closeConfirm,
  onLoading,
  openConfirm,
} from "../../Redux/StateManagement/confirmSlice";

import {
  Box,
  Chip,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import CustomTablePagination from "../../Components/Reusable/CustomTablePagination";
import Moment from "moment";

const SubUnit = () => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [status, setStatus] = useState("active");
  const [search, setSearch] = useState("");
  const [updateSubUnit, setUpdateSubUnit] = useState({
    status: false,
    id: null,
    subunit_name: "",
  });

  const dispatch = useDispatch();
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

  const onSetPage = () => {
    setPage(1);
  };

  const {
    data: subUnitData,
    isLoading: subUnitLoading,
    isSuccess: subUnitSuccess,
    isError: isPostError,
    error: errorData,
    refetch,
  } = useGetSubUnitApiQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

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
            const result = await postSubUnitStatusApi({
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
    const { id, subunit_name } = props;
    setUpdateSubUnit({
      status: true,
      id: id,
      subunit_name: subunit_name,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateSubUnit({
      status: false,
      id: null,
      subunit_name: "",
    });
  };

  return (
    <Box className="mcontainer">
      <Typography
        className="mcontainer__title"
        sx={{ fontFamily: "Anton", fontSize: "2rem" }}
      >
        Sub Unit
      </Typography>
      {subUnitLoading && <MasterlistSkeleton onAdd={true} />}
      {isPostError && <ErrorFetching refetch={refetch} error={errorData} />}
      {subUnitData && !isPostError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar
              path="#"
              onStatusChange={setStatus}
              onSearchChange={setSearch}
              onSetPage={setPage}
              onAdd={() => {}}
            />

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
                          active={orderBy === `subunit_name`}
                          direction={orderBy === `subunit_name` ? order : `asc`}
                          onClick={() => onSort(`subunit_name`)}
                        >
                          Type of Request
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
                    {subUnitData?.data?.length === 0 ? (
                      <NoRecordsFound />
                    ) : (
                      <>
                        {subUnitSuccess &&
                          [...subUnitData?.data]
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
                                  {data.subunit_name}
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
              total={subUnitData?.total}
              success={subUnitSuccess}
              current_page={subUnitData?.current_page}
              per_page={subUnitData?.per_page}
              onPageChange={pageHandler}
              onRowsPerPageChange={limitHandler}
            />
          </Box>
        </>
      )}
      <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddSubUnit
          data={updateSubUnit}
          onUpdateResetHandler={onUpdateResetHandler}
        />
      </Dialog>
    </Box>
  );
};

export default SubUnit;
