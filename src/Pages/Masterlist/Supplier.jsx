import React, { useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import AddSupplier from "./AddEdit/AddSupplier";

// RTK
import { useDispatch } from "react-redux";
import { openToast } from "../../Redux/StateManagement/toastSlice";
import {
  openConfirm,
  closeConfirm,
  onLoading,
} from "../../Redux/StateManagement/confirmSlice";
import {
  usePostSupplierStatusApiMutation,
  useGetSupplierApiQuery,
} from "../../Redux/Query/Masterlist/SupplierApi";

import { useSelector } from "react-redux";

// MUI
import {
  Box,
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
import { Help, ReportProblem } from "@mui/icons-material";
import MasterlistSkeleton from "../Skeleton/MasterlistSkeleton";
import ErrorFetching from "../ErrorFetching";
import NoRecordsFound from "../../Layout/NoRecordsFound";

const Supplier = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);
  const [updateSupplier, setUpdateSupplier] = useState({
    status: false,
    id: null,
    supplier_name: "",
    address: "",
    contact_no: null,
  });

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

  const drawer = useSelector((state) => state.booleanState.drawer);

  const limitHandler = (e) => {
    setPage(1);
    setLimit(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const {
    data: supplierData,
    isLoading: supplierLoading,
    isSuccess: supplierSuccess,
    isError: supplierError,
    error: errorData,
    refetch,
  } = useGetSupplierApiQuery(
    {
      page: page,
      limit: limit,
      status: status,
      search: search,
    },
    { refetchOnMountOrArgChange: true }
  );

  const [postSupplierStatusApi, { isLoading }] =
    usePostSupplierStatusApiMutation();

  const dispatch = useDispatch();

  const onArchiveRestoreHandler = async (id) => {
    dispatch(
      openConfirm({
        icon: status === "active" ? ReportProblem : Help,
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
            const result = await postSupplierStatusApi({
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
            console.log(err.message);
          }
        },
      })
    );
  };

  const onUpdateHandler = (props) => {
    const { id, supplier_name, address, contact_no } = props;
    setUpdateSupplier({
      status: true,
      id: id,
      supplier_name: supplier_name,
      address: address,
      contact_no: contact_no,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateSupplier({
      status: false,
      id: null,
      supplier_name: "",
      address: "",
      contact_no: null,
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <Box className="mcontainer">
      <Typography
        className="mcontainer__title"
        sx={{ fontFamily: "Anton", fontSize: "2rem" }}
      >
        Suppliers
      </Typography>

      {supplierLoading && <MasterlistSkeleton onAdd={true} />}

      {supplierError && <ErrorFetching refetch={refetch} error={errorData} />}

      {supplierData && !supplierError && (
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
                        active={orderBy === `supplier_name`}
                        direction={orderBy === `supplier_name` ? order : `asc`}
                        onClick={() => onSort(`supplier_name`)}
                      >
                        Supplier
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel
                        active={orderBy === `address`}
                        direction={orderBy === `address` ? order : `asc`}
                        onClick={() => onSort(`address`)}
                      >
                        Address
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell text-center">
                      Contact Number
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

                    <TableCell className="tbl-cell text-center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {supplierData.data.length === 0 ? (
                    <NoRecordsFound />
                  ) : (
                    <>
                      {supplierSuccess &&
                        [...supplierData.data]
                          .sort(comparator(order, orderBy))
                          .map((data) => (
                            <TableRow
                              key={data.id}
                              hover={true}
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
                                {data.supplier_name}
                              </TableCell>

                              <TableCell className="tbl-cell">
                                {data.address}
                              </TableCell>

                              <TableCell className="tbl-cell text-center">
                                {data.contact_no}
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
                                {Moment(data.created_at).format("MMM DD, YYYY")}
                              </TableCell>

                              <TableCell className="tbl-cell text-center">
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

          <Box className="mcontainer__pagination">
            <TablePagination
              rowsPerPageOptions={[
                5,
                10,
                15,
                { label: "All", value: parseInt(supplierData?.total) },
              ]}
              component="div"
              count={supplierSuccess ? supplierData.total : 0}
              page={supplierSuccess ? supplierData.current_page - 1 : 0}
              rowsPerPage={
                supplierSuccess ? parseInt(supplierData?.per_page) : 5
              }
              onPageChange={pageHandler}
              onRowsPerPageChange={limitHandler}
            />
          </Box>
        </Box>
      )}

      <Dialog open={drawer} PaperProps={{ sx: { borderRadius: "10px" } }}>
        <AddSupplier
          data={updateSupplier}
          onUpdateResetHandler={onUpdateResetHandler}
        />
      </Dialog>
    </Box>
  );
};

export default Supplier;
