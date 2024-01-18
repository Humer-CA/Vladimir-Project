import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomNumberField from "../../../Components/Reusable/CustomNumberField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import { closeDialog, closeDialog1, closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";

import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";

import {
  useAddPurchaseRequestApiMutation,
  useGetPurchaseRequestAllApiQuery,
} from "../../../Redux/Query/Request/PurchaseRequest";
import { useGetCompanyAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Company";
import { useNavigate } from "react-router-dom";
import { ArrowBackIosRounded, Delete, Remove, RemoveCircle, Visibility } from "@mui/icons-material";
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import {
  useGetAssetReceivingApiQuery,
  useGetItemPerTransactionApiQuery,
} from "../../../Redux/Query/Request/AssetReceiving/AssetReceiving";
import moment from "moment";
import { useGetByTransactionApiQuery } from "../../../Redux/Query/Request/Requisition";

const schema = yup.object().shape({
  id: yup.string(),
  transaction_number: yup.number(),
  pr_number: yup.string().required(),
  business_unit_id: yup.object().required(),
});

const ViewReceivingItems = (props) => {
  const { transactionData } = props;
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    data: receivingData,
    isLoading: receivingLoading,
    isSuccess: receivingSuccess,
    refetch: receivingRefetch,
  } = useGetItemPerTransactionApiQuery(
    {
      page: page,
      per_page: perPage,
      transaction_number: transactionData?.transaction_number,
    },
    { refetchOnMountOrArgChange: true }
  );

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

  const handleCloseDialog = () => {
    dispatch(closeDialog1());
  };

  return (
    <Stack width="100%" gap={2}>
      <Stack flexDirection="row">
        <Button
          variant="text"
          color="secondary"
          size="small"
          startIcon={<ArrowBackIosRounded color="secondary" />}
          onClick={() => {
            handleCloseDialog();
          }}
          disableRipple
          sx={{ marginLeft: "-15px", "&:hover": { backgroundColor: "transparent" } }}
        />
        <Typography
          color="secondary.main"
          sx={{ fontFamily: "Anton", fontSize: "1.5rem", alignSelf: "flex-start" }}
          textTransform="uppercase"
        >
          Select Request
        </Typography>
      </Stack>

      <TableContainer className="mcontainer__th-body-category">
        <Table className="mcontainer__table" stickyHeader>
          <TableHead>
            <TableRow
              sx={{
                "& > *": {
                  fontWeight: "bold!important",
                  whiteSpace: "nowrap",
                  backgroundColor: "secondary.main",
                  color: "white",
                  ":hover": { color: "white" },
                },
                "& > span": {
                  ":hover": { color: "white" },
                },
              }}
            >
              <TableCell className="tbl-cell">
                <TableSortLabel
                  active={orderBy === `type_of_request`}
                  direction={orderBy === `type_of_request` ? order : `asc`}
                  onClick={() => onSort(`type_of_request`)}
                >
                  Type of Request
                </TableSortLabel>
              </TableCell>

              <TableCell className="tbl-cell">
                <TableSortLabel
                  active={orderBy === `pr_number`}
                  direction={orderBy === `pr_number` ? order : `asc`}
                  onClick={() => onSort(`pr_number`)}
                >
                  PR Number
                </TableSortLabel>
              </TableCell>

              <TableCell className="tbl-cell">
                <TableSortLabel
                  active={orderBy === `reference_number`}
                  direction={orderBy === `reference_number` ? order : `asc`}
                  onClick={() => onSort(`reference_number`)}
                >
                  Ref Number
                </TableSortLabel>
              </TableCell>

              <TableCell className="tbl-cell">
                <TableSortLabel>Asset Information</TableSortLabel>
              </TableCell>

              <TableCell className="tbl-cell">
                <TableSortLabel>Chart of Accounts</TableSortLabel>
              </TableCell>

              <TableCell className="tbl-cell text-center">
                <TableSortLabel
                  active={orderBy === `item_count`}
                  direction={orderBy === `item_count` ? order : `asc`}
                  onClick={() => onSort(`item_count`)}
                >
                  Ordered
                </TableSortLabel>
              </TableCell>

              <TableCell className="tbl-cell text-center">
                <TableSortLabel
                  active={orderBy === `item_count`}
                  direction={orderBy === `item_count` ? order : `asc`}
                  onClick={() => onSort(`item_count`)}
                >
                  Delivered
                </TableSortLabel>
              </TableCell>

              <TableCell className="tbl-cell text-center">
                <TableSortLabel
                  active={orderBy === `item_count`}
                  direction={orderBy === `item_count` ? order : `asc`}
                  onClick={() => onSort(`item_count`)}
                >
                  Remaining
                </TableSortLabel>
              </TableCell>
              <TableCell className="tbl-cell text-center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {receivingData?.data?.length === 0 ? (
              <NoRecordsFound />
            ) : (
              <>
                {receivingSuccess &&
                  [...receivingData?.data]?.sort(comparator(order, orderBy))?.map((data) => (
                    <TableRow
                      key={data.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <TableCell className="tbl-cell text-weight">
                        <Typography>{data.type_of_request?.type_of_request_name}</Typography>
                        <Typography fontSize="12px" fontWeight="bold" color="primary">
                          {data.attachment_type}
                        </Typography>
                        {console.log(data)}
                      </TableCell>
                      <TableCell className="tbl-cell ">PR - {data.pr_number}</TableCell>
                      <TableCell className="tbl-cell ">{data.reference_number}</TableCell>
                      <TableCell className="tbl-cell tr-cen-pad45">{data.asset_description}</TableCell>
                      <TableCell className="tbl-cell text-center">
                        <Typography
                          fontSize={12}
                          noWrap
                        >{`(${data.company?.company_code}) - ${data.company?.company_name}`}</Typography>
                        <Typography
                          fontSize={12}
                          noWrap
                        >{`(${data.department?.department_code}) - ${data.department?.department_name}`}</Typography>
                        <Typography
                          fontSize={12}
                          noWrap
                        >{`(${data.location?.location_code}) - ${data.location?.location_name}`}</Typography>
                        <Typography
                          fontSize={12}
                          noWrap
                        >{`(${data.account_title?.account_title_code}) - ${data.account_title?.account_title_name}`}</Typography>
                      </TableCell>

                      <TableCell className="tbl-cell tr-cen-pad45">{data?.ordered}</TableCell>
                      <TableCell className="tbl-cell tr-cen-pad45">{data?.delivered}</TableCell>
                      <TableCell className="tbl-cell tr-cen-pad45">{data?.remaining}</TableCell>
                      <TableCell className="tbl-cell tr-cen-pad45">
                        <IconButton sx={{ color: "error.main", ":hover": { color: "red" } }}>
                          <RemoveCircle />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
              </>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default ViewReceivingItems;
