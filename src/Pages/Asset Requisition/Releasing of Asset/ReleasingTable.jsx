import React, { useEffect, useState } from "react";
import Moment from "moment";
import MasterlistToolbar from "../../../Components/Reusable/MasterlistToolbar";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import ErrorFetching from "../../ErrorFetching";
import MasterlistSkeleton from "../../Skeleton/MasterlistSkeleton";
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import CustomTablePagination from "../../../Components/Reusable/CustomTablePagination";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../../Redux/StateManagement/confirmSlice";

// MUI
import {
  Box,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Help, LibraryAdd, Report, ReportProblem, Visibility } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { closeDialog, openDialog } from "../../../Redux/StateManagement/booleanStateSlice";

import { useGetAssetReleasingQuery } from "../../../Redux/Query/Request/AssetReleasing";

const ReleasingTable = (props) => {
  const { withVtn } = props;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [release, setRelease] = useState(1);

  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width: 500px)");

  //* Table Sorting -------------------------------------------------------
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

  //* Table Properties ---------------------------------------------------
  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const {
    data: releasingData,
    isLoading: releasingLoading,
    isSuccess: releasingSuccess,
    isError: releasingError,
    error: errorData,
    refetch,
  } = useGetAssetReleasingQuery(
    {
      page: page,
      per_page: perPage,
      status: status,
      search: search,
      released: release,
    },
    { refetchOnMountOrArgChange: true }
  );

  const dispatch = useDispatch();

  const handleViewData = (data) => {
    navigate(`/asset-requisition/requisition-releasing/${data.warehouse_number?.warehouse_number}`, {
      state: { ...data, withVtn },
    });
  };

  const onSetPage = () => {
    setPage(1);
  };

  return (
    <Stack sx={{ height: "calc(100vh - 250px)" }}>
      {releasingLoading && <MasterlistSkeleton onAdd={true} category />}
      {releasingError && <ErrorFetching refetch={refetch} error={errorData} />}
      {releasingData && !releasingError && (
        <>
          <Box className="mcontainer__wrapper">
            <MasterlistToolbar onStatusChange={setStatus} onSearchChange={setSearch} onSetPage={setPage} hideArchive />

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
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `warehouse_number`}
                          direction={orderBy === `warehouse_number` ? order : `asc`}
                          onClick={() => onSort(`warehouse_number`)}
                        >
                          Warehouse No.
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `warehouse_number`}
                          direction={orderBy === `warehouse_number` ? order : `asc`}
                          onClick={() => onSort(`warehouse_number`)}
                        >
                          Type of Request
                        </TableSortLabel>
                      </TableCell>
                      {withVtn && (
                        <TableCell className="tbl-cell">
                          <TableSortLabel
                            active={orderBy === `vladimir_tag_number`}
                            direction={orderBy === `vladimir_tag_number` ? order : `asc`}
                            onClick={() => onSort(`vladimir_tag_number`)}
                          >
                            Vladimir Tag Number
                          </TableSortLabel>
                        </TableCell>
                      )}
                      <TableCell className="tbl-cell">Oracle No.</TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `warehouse_number`}
                          direction={orderBy === `warehouse_number` ? order : `asc`}
                          onClick={() => onSort(`warehouse_number`)}
                        >
                          Requestor
                        </TableSortLabel>
                      </TableCell>
                      <TableCell className="tbl-cell">Chart of Accounts</TableCell>
                      <TableCell className="tbl-cell">Accountability</TableCell>
                      <TableCell className="tbl-cell">
                        <TableSortLabel
                          active={orderBy === `created_at`}
                          direction={orderBy === `created_at` ? order : `asc`}
                          onClick={() => onSort(`created_at`)}
                        >
                          Date Created
                        </TableSortLabel>
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {releasingData?.data?.length === 0 ? (
                      <NoRecordsFound category />
                    ) : (
                      <>
                        {releasingSuccess &&
                          [...releasingData?.data]?.sort(comparator(order, orderBy))?.map((data) => (
                            <TableRow
                              key={data.id}
                              hover
                              onClick={() => handleViewData(data)}
                              sx={{
                                "&:last-child td, &:last-child th": {
                                  borderBottom: 0,
                                },
                                cursor: "pointer",
                              }}
                            >
                              <TableCell className="tbl-cell">{data.warehouse_number?.warehouse_number}</TableCell>
                              <TableCell className="tbl-cell">
                                <Typography fontSize={12} fontWeight={600} color="primary.main">
                                  {data.type_of_request?.type_of_request_name}
                                </Typography>
                                <Typography fontSize={14} fontWeight={600}>
                                  {data.asset_description}
                                </Typography>
                                <Typography fontSize={14}>{data.asset_specification}</Typography>
                              </TableCell>
                              {withVtn && (
                                <TableCell className="tbl-cell text-weight">{data.vladimir_tag_number}</TableCell>
                              )}
                              <TableCell className="tbl-cell">
                                <Typography fontSize={12} color="text.light">
                                  PR - {data.pr_number}
                                </Typography>
                                <Typography fontSize={12} color="text.light">
                                  PO - {data.po_number}
                                </Typography>
                                <Typography fontSize={12} color="text.light">
                                  RR - {data.rr_number}
                                </Typography>
                              </TableCell>
                              <TableCell className="tbl-cell ">
                                {`(${data.requestor?.employee_id}) - ${data.requestor?.firstname} ${data.requestor?.lastname}`}
                              </TableCell>
                              <TableCell className="tbl-cell">
                                <Typography fontSize={10} color="gray">
                                  ({data.company?.company_code}) - {data.company?.company_name}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  ({data.department?.department_code}) - {data.department?.department_name}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  ({data.location?.location_code}) - {data.location?.location_name}
                                </Typography>
                                <Typography fontSize={10} color="gray">
                                  ({data.account_title?.account_title_code}) - {data.account_title?.account_title_name}
                                </Typography>
                              </TableCell>
                              <TableCell className="tbl-cell">
                                <Typography fontSize={14} fontWeight={600}>
                                  {data.accountability}
                                </Typography>
                                <Typography fontSize={12}>{data.accountable}</Typography>
                              </TableCell>
                              <TableCell className="tbl-cell tr-cen-pad45">
                                {Moment(data.created_at).format("MMM DD, YYYY")}
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
              total={releasingData?.total}
              success={releasingSuccess}
              current_page={releasingData?.current_page}
              per_page={releasingData?.per_page}
              onPageChange={pageHandler}
              onRowsPerPageChange={perPageHandler}
            />
          </Box>
        </>
      )}
    </Stack>
  );
};

export default ReleasingTable;
