import React, { useEffect, useRef, useState } from "react";
import "../../Style/Request/request.scss";
import CustomTextField from "../../Components/Reusable/CustomTextField";
import CustomNumberField from "../../Components/Reusable/CustomNumberField";
import CustomAutoComplete from "../../Components/Reusable/CustomAutoComplete";
import CustomAttachment from "../../Components/Reusable/CustomAttachment";
import { LoadingData } from "../../Components/LottieFiles/LottieComponents";
import { useGetSedarUsersApiQuery } from "../../Redux/Query/SedarUserApi";

import {
    Box,
    Button,
    Divider,
    IconButton,
    InputAdornment,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
    createFilterOptions,
    useMediaQuery,
} from "@mui/material";
import { AddToPhotos, ArrowBackIosRounded, Create, Remove, Report, Save, SaveAlt, Update } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

// RTK
import { useDispatch } from "react-redux";
import { closeDrawer } from "../../Redux/StateManagement/booleanStateSlice";
import { useGetCompanyAllApiQuery } from "../../Redux/Query/Masterlist/FistoCoa/Company";
import { useGetDepartmentAllApiQuery } from "../../Redux/Query/Masterlist/FistoCoa/Department";
import { useGetLocationAllApiQuery } from "../../Redux/Query/Masterlist/FistoCoa/Location";
import { useGetAccountTitleAllApiQuery } from "../../Redux/Query/Masterlist/FistoCoa/AccountTitle";
import {
    useGetByTransactionApiQuery,
} from "../../Redux/Query/Request/Requisition";

import { useGetTypeOfRequestAllApiQuery } from "../../Redux/Query/Masterlist/TypeOfRequest";
import { useLocation, useNavigate } from "react-router-dom";
import NoRecordsFound from "../../Layout/NoRecordsFound";
import { useGetSubUnitAllApiQuery } from "../../Redux/Query/Masterlist/SubUnit";
import ActionMenu from "../../Components/Reusable/ActionMenu";
import {
    useGetRequestContainerAllApiQuery,
} from "../../Redux/Query/Request/RequestContainer";
import CustomPatternfield from "../../Components/Reusable/CustomPatternfield";


const ViewRequestMonitoring = (props) => {

    const { state: transactionData } = useLocation();

    const dispatch = useDispatch();
    const navigate = useNavigate();


    // CONTAINER
    const {
        data: addRequestAllApi = [],
        isLoading: isRequestLoading,
        refetch: isRequestRefetch,
    } = useGetRequestContainerAllApiQuery({ refetchOnMountOrArgChange: true });

    const {
        data: transactionDataApi = [],
        isLoading: isTransactionLoading,
        refetch: isTransactionRefetch,
    } = useGetByTransactionApiQuery(
        { transaction_number: transactionData?.transaction_number },
        { refetchOnMountOrArgChange: true }
    );


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


    const handleCloseDrawer = () => {
        dispatch(closeDrawer());
    };

    const filterOptions = createFilterOptions({
        limit: 100,
        matchFrom: "any",
    });


    return (
        <>
            <Box className="mcontainer" sx={{ height: "calc(100vh - 380px)" }}>
                <Button
                    variant="text"
                    color="secondary"
                    size="small"
                    startIcon={<ArrowBackIosRounded color="secondary" />}
                    onClick={() => {
                        navigate(-1);
                    }}
                    sx={{ width: "90px", marginLeft: "-15px" }}
                >
                    <Typography color="secondary.main">Back</Typography>
                </Button>

                <Box className="request mcontainer__wrapper" p={2}>


                    {/* TABLE */}
                    <Box className="request__table">
                        <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
                            {`${transactionData ? "TRANSACTION NO." : "CURRENT ASSET"}`} {transactionData && transactionData?.transaction_number}
                        </Typography>

                        <TableContainer
                            className="mcontainer__th-body  mcontainer__wrapper"
                            sx={{ height: "calc(100vh - 290px)", pt: 0 }}
                        >
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
                                        <TableCell className="tbl-cell">Attachment Type</TableCell>
                                        <TableCell className="tbl-cell">Chart of Accounts</TableCell>
                                        <TableCell className="tbl-cell">Accountability</TableCell>
                                        <TableCell className="tbl-cell">Asset Information</TableCell>
                                        <TableCell className="tbl-cell text-center">Quantity</TableCell>
                                        <TableCell className="tbl-cell">Cellphone #</TableCell>
                                        <TableCell className="tbl-cell">Remarks</TableCell>
                                        <TableCell className="tbl-cell">Attachments</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {isRequestLoading || isTransactionLoading ? <LoadingData /> :
                                        (transactionData ? transactionDataApi?.length === 0 : addRequestAllApi?.length === 0) ? (
                                            <NoRecordsFound />
                                        ) : (
                                            <>
                                                {(transactionData
                                                    ? transactionDataApi : addRequestAllApi).map((data, index) => (
                                                        <TableRow
                                                            key={index}
                                                            sx={{
                                                                "&:last-child td, &:last-child th": {
                                                                    borderBottom: 0,
                                                                },
                                                            }}
                                                        >
                                                            <TableCell className="tbl-cell tr-cen-pad45 text-weight">{index + 1}</TableCell>
                                                            <TableCell className="tbl-cell">{data.type_of_request?.type_of_request_name}</TableCell>
                                                            <TableCell className="tbl-cell">{data.attachment_type}</TableCell>
                                                            <TableCell className="tbl-cell">
                                                                <Typography fontSize={10} color="gray">
                                                                    {`(${data.company?.company_code}) - ${data.company?.company_name}`}
                                                                </Typography>
                                                                <Typography fontSize={10} color="gray">
                                                                    {`(${data.department?.department_code}) - ${data.department?.department_name}`}
                                                                </Typography>
                                                                <Typography fontSize={10} color="gray">
                                                                    {`(${data.location?.location_code}) - ${data.location?.location_name}`}
                                                                </Typography>
                                                                <Typography fontSize={10} color="gray">
                                                                    {`(${data.account_title?.account_title_code}) - ${data.account_title?.account_title_name}`}
                                                                </Typography>
                                                            </TableCell>

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

                                                            <TableCell className="tbl-cell">
                                                                {data?.attachments?.letter_of_request && (
                                                                    <Stack flexDirection="row" gap={1}>
                                                                        <Typography fontSize={12} fontWeight={600}>
                                                                            Letter of Request:
                                                                        </Typography>
                                                                        {data?.attachments?.letter_of_request?.file_name}
                                                                    </Stack>
                                                                )}

                                                                {data?.attachments?.quotation && (
                                                                    <Stack flexDirection="row" gap={1}>
                                                                        <Typography fontSize={12} fontWeight={600}>
                                                                            Quotation:
                                                                        </Typography>
                                                                        {data?.attachments?.quotation?.file_name}
                                                                    </Stack>
                                                                )}

                                                                {data?.attachments?.specification_form && (
                                                                    <Stack flexDirection="row" gap={1}>
                                                                        <Typography fontSize={12} fontWeight={600}>
                                                                            Specification:
                                                                        </Typography>
                                                                        {data?.attachments?.specification_form?.file_name}
                                                                    </Stack>
                                                                )}

                                                                {data?.attachments?.tool_of_trade && (
                                                                    <Stack flexDirection="row" gap={1}>
                                                                        <Typography fontSize={12} fontWeight={600}>
                                                                            Tool of Trade:
                                                                        </Typography>
                                                                        {data?.attachments?.tool_of_trade?.file_name}
                                                                    </Stack>
                                                                )}

                                                                {data?.attachments?.other_attachments && (
                                                                    <Stack flexDirection="row" gap={1}>
                                                                        <Typography fontSize={12} fontWeight={600}>
                                                                            Other Attachment:
                                                                        </Typography>
                                                                        {data?.attachments?.other_attachments?.file_name}
                                                                    </Stack>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                }
                                            </>
                                        )
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Buttons */}
                        <Stack flexDirection="row" justifyContent="space-between" alignItems={"center"}>
                            <Typography fontFamily="Anton, Impact, Roboto" fontSize="18px" color="secondary.main" sx={{ pt: "10px" }}>
                                Transactions : {" "}
                                {transactionData ? transactionDataApi.length : addRequestAllApi.length} request
                            </Typography>

                            <Stack flexDirection="row" justifyContent="flex-end" gap={2} sx={{ pt: "10px" }}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    color="secondary"
                                    onClick={() => {
                                        navigate(-1);
                                    }}
                                >
                                    Cancel
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Box>
            </Box >
        </>
    );
};

export default ViewRequestMonitoring;
