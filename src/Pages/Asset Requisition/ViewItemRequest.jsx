import React, { useEffect, useRef, useState } from "react";
import "../../Style/Request/request.scss";
import { LoadingData } from "../../Components/LottieFiles/LottieComponents";

import {
  Box,
  Button,
  Dialog,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";

// RTK
import { useDispatch, useSelector } from "react-redux";

import { useLocation, useNavigate } from "react-router-dom";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import { useGetApprovalIdApiQuery } from "../../Redux/Query/Approving/Approval";
import { closeDialog } from "../../Redux/StateManagement/booleanStateSlice";
import { useGetRequisitionPerItemApiQuery } from "../../Redux/Query/Request/Requisition";

const ViewItemRequest = (props) => {
  const { data: transactionData } = props;
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const isSmallWidth = useMediaQuery("(max-width: 700px)");

  // CONTAINER
  const {
    data: perItemData,
    isLoading: isApproveLoading,
    isSuccess: isApproveSuccess,
    isError: isError,
    error: errorData,
    refetch: isApproveRefetch,
  } = useGetRequisitionPerItemApiQuery({
    page: page,
    per_page: perPage,
    reference_number: transactionData?.reference_number,
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

  const perPageHandler = (e) => {
    setPage(1);
    setPerPage(parseInt(e.target.value));
  };

  const pageHandler = (_, page) => {
    // console.log(page + 1);
    setPage(page + 1);
  };

  const servedDatas = () =>
    perItemData?.served?.data?.map((data, index) => (
      <Box key={index}>
        <Stack>
          <Typography fontSize={14}>Type of Request: </Typography>
          <Typography fontSize={14}>{data?.type_of_request}</Typography>
        </Stack>
        <Stack>
          <Typography fontSize={14}>Acquisition Details: </Typography>
          <Typography fontSize={14}>{data?.acquisition_details}</Typography>
        </Stack>
        <Stack>
          <Typography fontSize={14}>Attachment Type: </Typography>
          <Typography fontSize={14}>{data?.attachment_type}</Typography>
        </Stack>
        <Stack>
          <Typography fontSize={14}>Chart of Accounts: </Typography>
          <Typography fontSize={14}>{data?.attachment_type}</Typography>
        </Stack>
        <Stack>
          <Typography fontSize={14}>Accountability: </Typography>
          <Typography fontSize={14}>{data?.accountability}</Typography>
        </Stack>
        <Stack>
          <Typography fontSize={14}>Asset Information: </Typography>
          <Typography fontSize={14} fontWeight={600}>
            {data?.asset_description}
          </Typography>
          <Typography fontSize={14}>{data?.asset_specification}</Typography>
        </Stack>
        <Typography fontSize={14}>Quantity: </Typography>
        <Typography fontSize={14}>Cellphone #: </Typography>
        <Typography fontSize={14}>Remarks: </Typography>
        <Typography fontSize={14}>Attachments: </Typography>
      </Box>
    ));

  const servedData = perItemData?.served?.data?.map((data) => data);
  const cancelledData = perItemData?.cancelled?.data?.map((data) => data);
  return (
    <>
      <Box className="request__table">
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem", pl: isSmallWidth ? 0 : 2 }}>
            REFERENCE: {transactionData?.reference_number}
          </Typography>

          <IconButton onClick={() => dispatch(closeDialog())}>
            <Close />
          </IconButton>
        </Stack>

        {/* <Stack>{servedData()}</Stack> */}

        <Stack
          flexDirection="row"
          justifyContent="center"
          gap={2}
          p={1}
          flexWrap={isSmallWidth ? "wrap" : null}
          maxHeight="420px"
          overflow="auto"
        >
          <Stack maxWidth={isSmallWidth ? "90%" : "48%"}>
            <Typography color="success.dark" sx={{ fontFamily: "Anton", fontSize: "1.3rem", pl: isSmallWidth ? 0 : 2 }}>
              Served Data
            </Typography>
            <TableContainer className="mcontainer__th-body  mcontainer__wrapper">
              <Table className="mcontainer__table " stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      "& > *": {
                        fontWeight: "bold!important",
                        whiteSpace: "nowrap",
                      },
                    }}
                  >
                    <TableCell className="tbl-cell">Index</TableCell>
                    <TableCell className="tbl-cell">Type of Request</TableCell>
                    <TableCell className="tbl-cell">Acquisition Details</TableCell>
                    <TableCell className="tbl-cell">Attachment Type</TableCell>
                    <TableCell className="tbl-cell">Accountability</TableCell>
                    <TableCell className="tbl-cell">Asset Information</TableCell>
                    <TableCell className="tbl-cell text-center">Quantity</TableCell>
                    <TableCell className="tbl-cell">Cellphone #</TableCell>
                    <TableCell className="tbl-cell">Remarks</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isApproveLoading && <LoadingData />}
                  {servedData?.length === 0 ? (
                    <NoRecordsFound />
                  ) : (
                    <>
                      {servedData?.map((data, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              borderBottom: 0,
                            },
                          }}
                        >
                          <TableCell className="tbl-cell" align="center">
                            {index}
                          </TableCell>
                          <TableCell className="tbl-cell">{data.type_of_request?.type_of_request_name}</TableCell>
                          <TableCell className="tbl-cell">{data.acquisition_details}</TableCell>
                          <TableCell className="tbl-cell">{data.attachment_type}</TableCell>
                          {/* <TableCell className="tbl-cell">
                              <Typography fontSize={10} color="gray">
                                {`(${data.company?.company_code}) - ${data.company?.company_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.department?.department_code}) - ${data.department?.department_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.subunit?.subunit_code}) - ${data.subunit?.subunit_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.location?.location_code}) - ${data.location?.location_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.account_title?.account_title_code}) - ${data.account_title?.account_title_name}`}
                              </Typography>
                            </TableCell> */}

                          <TableCell className="tbl-cell">
                            {data.accountability === "Personal Issued" ? (
                              <>
                                <Box>{data?.accountable?.general_info?.full_id_number}</Box>
                                <Box>{data?.accountable?.general_info?.full_name}</Box>
                              </>
                            ) : (
                              "Common"
                            )}
                          </TableCell>

                          <TableCell className="tbl-cell">
                            <Typography fontWeight={600} fontSize="14px" color="secondary.main">
                              {data.asset_description}
                            </Typography>
                            <Typography fontSize="12px" color="text.light">
                              {data.asset_specification}
                            </Typography>
                          </TableCell>

                          <TableCell className="tbl-cell text-center">{data.quantity}</TableCell>

                          <TableCell className="tbl-cell">
                            {data.cellphone_number === null ? "-" : data.cellphone_number}
                          </TableCell>

                          <TableCell className="tbl-cell">
                            {data.remarks === null ? "No Remarks" : data.remarks}
                          </TableCell>

                          {/* <TableCell className="tbl-cell">
                          {data?.attachments?.letter_of_request && (
                            <Stack flexDirection="row" gap={1}>
                              <Typography fontSize={12} fontWeight={600}>
                                Letter of Request:
                              </Typography>
                              <Tooltip title="Download Letter of Request">
                                <Typography
                                  sx={attachmentSx}
                                  onClick={() => handleDownloadAttachment({ value: "letter_of_request", id: data?.id })}
                                >
                                  {data?.attachments?.letter_of_request?.file_name}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          )}
                          {data?.attachments?.quotation && (
                            <Stack flexDirection="row" gap={1}>
                              <Typography fontSize={12} fontWeight={600}>
                                Quotation:
                              </Typography>
                              <Tooltip title="Download Quotation">
                                <Typography
                                  sx={attachmentSx}
                                  onClick={() => handleDownloadAttachment({ value: "quotation", id: data?.id })}
                                >
                                  {data?.attachments?.quotation?.file_name}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          )}
                          {data?.attachments?.specification_form && (
                            <Stack flexDirection="row" gap={1}>
                              <Typography fontSize={12} fontWeight={600}>
                                Specification:
                              </Typography>
                              <Tooltip title="Download Specification">
                                <Typography
                                  sx={attachmentSx}
                                  onClick={() =>
                                    handleDownloadAttachment({ value: "specification_form", id: data?.id })
                                  }
                                >
                                  {data?.attachments?.specification_form?.file_name}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          )}
                          {data?.attachments?.tool_of_trade && (
                            <Stack flexDirection="row" gap={1}>
                              <Typography fontSize={12} fontWeight={600}>
                                Tool of Trade:
                              </Typography>
                              <Tooltip title="Download Tool of Trade">
                                <Typography
                                  sx={attachmentSx}
                                  onClick={() => handleDownloadAttachment({ value: "tool_of_trade", id: data?.id })}
                                >
                                  {data?.attachments?.tool_of_trade?.file_name}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          )}
                          {data?.attachments?.other_attachments && (
                            <Stack flexDirection="row" gap={1}>
                              <Typography fontSize={12} fontWeight={600}>
                                Other Attachment:
                              </Typography>
                              <Tooltip title="Download Other Attachments">
                                <Typography
                                  sx={attachmentSx}
                                  onClick={() => handleDownloadAttachment({ value: "other_attachments", id: data?.id })}
                                >
                                  {data?.attachments?.other_attachments?.file_name}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          )}
                        </TableCell> */}
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>

          {<Divider orientation={isSmallWidth ? null : "vertical"} sx={{ height: "100%", alignSelf: "center" }} />}

          <Stack maxWidth={isSmallWidth ? "90%" : "48%"}>
            <Typography color="error.dark" sx={{ fontFamily: "Anton", fontSize: "1.3rem", pl: 2 }}>
              Cancelled Data
            </Typography>
            <TableContainer className="mcontainer__th-body  mcontainer__wrapper">
              <Table className="mcontainer__table " stickyHeader>
                <TableHead>
                  <TableRow
                    sx={{
                      "& > *": {
                        fontWeight: "bold!important",
                        whiteSpace: "nowrap",
                      },
                    }}
                  >
                    <TableCell className="tbl-cell">Type of Request</TableCell>
                    <TableCell className="tbl-cell">Acquisition Details</TableCell>
                    <TableCell className="tbl-cell">Attachment Type</TableCell>
                    {/* <TableCell className="tbl-cell">Chart of Accounts</TableCell> */}
                    <TableCell className="tbl-cell">Accountability</TableCell>
                    <TableCell className="tbl-cell">Asset Information</TableCell>
                    <TableCell className="tbl-cell text-center">Quantity</TableCell>
                    <TableCell className="tbl-cell">Cellphone #</TableCell>
                    <TableCell className="tbl-cell">Remarks</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isApproveLoading && <LoadingData />}
                  {cancelledData?.length === 0 ? (
                    <NoRecordsFound />
                  ) : (
                    <>
                      {cancelledData?.map((data, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": {
                              borderBottom: 0,
                            },
                          }}
                        >
                          <TableCell className="tbl-cell">{data.type_of_request?.type_of_request_name}</TableCell>
                          <TableCell className="tbl-cell">{data.acquisition_details}</TableCell>
                          <TableCell className="tbl-cell">{data.attachment_type}</TableCell>
                          {/* <TableCell className="tbl-cell">
                              <Typography fontSize={10} color="gray">
                                {`(${data.company?.company_code}) - ${data.company?.company_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.department?.department_code}) - ${data.department?.department_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.subunit?.subunit_code}) - ${data.subunit?.subunit_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.location?.location_code}) - ${data.location?.location_name}`}
                              </Typography>
                              <Typography fontSize={10} color="gray">
                                {`(${data.account_title?.account_title_code}) - ${data.account_title?.account_title_name}`}
                              </Typography>
                            </TableCell> */}

                          <TableCell className="tbl-cell">
                            {data.accountability === "Personal Issued" ? (
                              <>
                                <Box>{data?.accountable?.general_info?.full_id_number}</Box>
                                <Box>{data?.accountable?.general_info?.full_name}</Box>
                              </>
                            ) : (
                              "Common"
                            )}
                          </TableCell>

                          <TableCell className="tbl-cell">
                            <Typography fontWeight={600} fontSize="14px" color="secondary.main">
                              {data.asset_description}
                            </Typography>
                            <Typography fontSize="12px" color="text.light">
                              {data.asset_specification}
                            </Typography>
                          </TableCell>

                          <TableCell className="tbl-cell text-center">{data.quantity}</TableCell>

                          <TableCell className="tbl-cell">
                            {data.cellphone_number === null ? "-" : data.cellphone_number}
                          </TableCell>

                          <TableCell className="tbl-cell">
                            {data.remarks === null ? "No Remarks" : data.remarks}
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default ViewItemRequest;
