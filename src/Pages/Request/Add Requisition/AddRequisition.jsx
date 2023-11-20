import React, { useEffect, useState } from "react";
import "../../../Style/Request/request.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import CustomDatePicker from "../../../Components/Reusable/CustomDatePicker";
import CustomAttachment from "../../../Components/Reusable/CustomAttachment";
import { useGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { openToast } from "../../../Redux/StateManagement/toastSlice";

import {
  Box,
  Button,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
  createFilterOptions,
  useMediaQuery,
} from "@mui/material";
import {
  AddToPhotos,
  ArrowBackIosRounded,
  ArrowForwardIosRounded,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

// RTK
import { useDispatch } from "react-redux";
import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useGetCompanyAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Company";
import { useGetDepartmentAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Department";
import { useGetLocationAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Location";
import { useGetAccountTitleAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/AccountTitle";
import {
  usePostRequisitionApiMutation,
  useUpdateRequisitionApiMutation,
} from "../../../Redux/Query/Request/Requisition";

import { useGetTypeOfRequestAllApiQuery } from "../../../Redux/Query/Masterlist/TypeOfRequest";
import { useNavigate } from "react-router-dom";
import NoRecordsFound from "../../../Layout/NoRecordsFound";
import { useGetSubUnitAllApiQuery } from "../../../Redux/Query/Masterlist/SubUnit";

const schema = yup.object().shape({
  id: yup.string(),

  type_of_request_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Type of Request"),

  company_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Company"),

  department_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Department"),

  subunit_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Department"),

  account_title_id: yup
    .string()
    .transform((value) => {
      return value?.id.toString();
    })
    .required()
    .label("Account Title"),

  accountability: yup
    .string()
    .typeError("Accountability is a required field")
    .required()
    .label("Accountability"),

  accountable: yup
    .object()
    .nullable()
    .when("accountability", {
      is: (value) => value === "Personal Issued",
      then: (yup) =>
        yup
          .label("Accountable")
          .required()
          .typeError("Accountable is a required field"),
    }),
});

const AddRequisition = (props) => {
  const { data, onUpdateResetHandler } = props;

  const [requestList, setRequestList] = useState([]);

  const isFullWidth = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [
    postRequisition,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostRequisitionApiMutation();

  const [
    updateRequisition,
    {
      data: updateData,
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateRequisitionApiMutation();

  const {
    data: typeOfRequestData = [],
    isLoading: isTypeOfRequestLoading,
    isSuccess: isTypeOfRequestSuccess,
    isError: isTypeOfRequestError,
    refetch: isTypeOfRequestRefetch,
  } = useGetTypeOfRequestAllApiQuery();

  const {
    data: departmentData = [],
    isLoading: isDepartmentLoading,
    isSuccess: isDepartmentSuccess,
    isError: isDepartmentError,
    refetch: isDepartmentRefetch,
  } = useGetDepartmentAllApiQuery();

  const {
    data: subUnitData = [],
    isLoading: isSubUnitLoading,
    isSuccess: isSubUnitSuccess,
    isError: isSubUnitError,
  } = useGetSubUnitAllApiQuery();

  const {
    data: sedarData = [],
    isLoading: isSedarLoading,
    isSuccess: isSedarSuccess,
    isError: isSedarError,
  } = useGetSedarUsersApiQuery();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
    setError,
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      type_of_request_id: null,
      sub_capex_id: null,

      // division_id: null,
      // major_category_id: null,
      // minor_category_id: null,
      // company_id: null,
      department_id: null,
      subunit_id: null,
      // location_id: null,
      // account_title_id: null,

      asset_description: "",
      asset_specification: "",
      acquisition_date: null,
      accountability: null,
      accountable: null,
      cellphone_number: null,
      quantity: 1,
    },
  });

  // GPT error fetching ----------------------------------------------------------

  useEffect(() => {
    const errorData =
      (isPostError || isUpdateError) &&
      (postError?.status === 422 || updateError?.status === 422);

    if (errorData) {
      const errors = (postError?.data || updateError?.data)?.errors || {};

      Object.entries(errors).forEach(([name, [message]]) =>
        setError(name, { type: "validate", message })
      );
    }

    const showToast = () => {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    };

    errorData && showToast();
  }, [isPostError, isUpdateError]);

  useEffect(() => {
    if (isPostSuccess || isUpdateSuccess) {
      reset();
      handleCloseDrawer();
      dispatch(
        openToast({
          message: postData?.message || updateData?.message,
          duration: 5000,
        })
      );

      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
    }
  }, [isPostSuccess, isUpdateSuccess]);

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

  // SUBMIT HANDLER
  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateRequisition(formData);
      return;
    }
    postRequisition(formData);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  const sxSubtitle = {
    fontWeight: "bold",
    color: "secondary.main",
    fontFamily: "Anton",
    fontSize: "16px",
  };

  const filterOptions = createFilterOptions({
    limit: 100,
    matchFrom: "any",
  });

  const attachmentType = ["Budgeted", "Unbudgeted"];

  // console.log(errors);
  // console.log(watch("depreciation_method"));
  // console.log(data);

  return (
    <>
      <Box className="mcontainer" sx={{ gap: 1 }}>
        <Button
          variant="text"
          color="secondary"
          size="small"
          startIcon={<ArrowBackIosRounded color="secondary" />}
          onClick={() => navigate(-1)}
          sx={{ width: "90px" }}
        >
          <Typography color="secondary.main">Back</Typography>
        </Button>

        <Box className="request">
          {/* FORM */}
          <Box>
            <Typography
              color="secondary.main"
              sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
            >
              ASSET
              {/* {data.status ? "Edit Requisition" : "Add Requisition"} */}
            </Typography>

            <Divider sx={{}} />

            <Box
              className="request__form"
              component="form"
              onSubmit={handleSubmit(onSubmitHandler)}
            >
              <Stack gap={2}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    width: "100%",
                  }}
                >
                  <Typography sx={sxSubtitle}>Request Information</Typography>

                  <CustomAutoComplete
                    control={control}
                    name="type_of_request_id"
                    options={typeOfRequestData}
                    loading={isTypeOfRequestLoading}
                    size="small"
                    getOptionLabel={(option) => option.type_of_request_name}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField
                        color="secondary"
                        {...params}
                        label="Type of Request"
                        error={!!errors?.type_of_request_id}
                        helperText={errors?.type_of_request_id?.message}
                      />
                    )}
                    onChange={(_, value) => {
                      setValue("sub_capex_id", null);
                      // setValue("project_name", "");
                      return value;
                    }}
                  />

                  <CustomAutoComplete
                    control={control}
                    name="attachment-type"
                    options={attachmentType}
                    size="small"
                    renderInput={(params) => (
                      <TextField
                        color="secondary"
                        {...params}
                        label="Attachment Type"
                        error={!!errors?.attachment_type}
                        helperText={errors?.attachment_type?.message}
                      />
                    )}
                  />
                </Box>

                <Divider />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    width: "100%",
                  }}
                >
                  <Typography sx={sxSubtitle}>Charging Information</Typography>

                  {/* OLD Departments */}
                  <CustomAutoComplete
                    autoComplete
                    name="department_id"
                    control={control}
                    options={departmentData}
                    loading={isDepartmentLoading}
                    size="small"
                    getOptionLabel={(option) => option.department_name}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField
                        color="secondary"
                        {...params}
                        label="Department"
                        error={!!errors?.department_id?.message}
                        helperText={errors?.department_id?.message}
                      />
                    )}
                    onChange={(_, value) => {
                      setValue("subunit_id", null);
                      return value;
                    }}
                    disablePortal
                    fullWidth
                  />

                  <CustomAutoComplete
                    autoComplete
                    name="subunit_id"
                    control={control}
                    options={subUnitData?.filter(
                      (item) =>
                        item?.department?.id === watch("department_id")?.id
                    )}
                    loading={isSubUnitLoading}
                    size="small"
                    getOptionLabel={(option) => option.subunit_name}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    renderInput={(params) => (
                      <TextField
                        color="secondary"
                        {...params}
                        label="Subunit"
                        error={!!errors?.subunit_id}
                        helperText={errors?.subunit_id?.message}
                      />
                    )}
                  />
                </Box>

                <Divider sx={{ py: 0.5 }} />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    width: "100%",
                  }}
                >
                  <Typography sx={sxSubtitle}>Asset Information</Typography>

                  <CustomTextField
                    control={control}
                    name="asset_description"
                    label="Asset Description"
                    type="text"
                    color="secondary"
                    size="small"
                    disabled={data?.print_count >= 1}
                    error={!!errors?.asset_description}
                    helperText={errors?.asset_description?.message}
                    fullWidth
                    multiline
                  />

                  <CustomTextField
                    control={control}
                    name="asset_specification"
                    label="Asset Specification"
                    type="text"
                    color="secondary"
                    size="small"
                    error={!!errors?.asset_specification}
                    helperText={errors?.asset_specification?.message}
                    fullWidth
                    multiline
                  />

                  <CustomDatePicker
                    control={control}
                    name="acquisition_date"
                    label="Acquisition Date"
                    size="small"
                    views={["year", "month", "day"]}
                    openTo="year"
                    error={!!errors?.acquisition_date}
                    helperText={errors?.acquisition_date?.message}
                    fullWidth={isFullWidth ? true : false}
                    maxDate={new Date()}
                    reduceAnimations
                  />

                  <CustomAutoComplete
                    autoComplete
                    name="accountability"
                    control={control}
                    options={["Personal Issued", "Common"]}
                    size="small"
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <TextField
                        color="secondary"
                        {...params}
                        label="Accountability  "
                        error={!!errors?.accountability}
                        helperText={errors?.accountability?.message}
                      />
                    )}
                  />

                  {watch("accountability") === "Personal Issued" && (
                    <CustomAutoComplete
                      name="accountable"
                      control={control}
                      size="small"
                      includeInputInList
                      disablePortal
                      filterOptions={filterOptions}
                      options={sedarData}
                      loading={isSedarLoading}
                      getOptionLabel={
                        (option) =>
                          option.general_info?.full_id_number_full_name
                        // `(${option.general_info?.full_id_number}) - ${option.general_info?.full_name}`
                      }
                      isOptionEqualToValue={(option, value) =>
                        option.general_info?.full_id_number ===
                        value.general_info?.full_id_number
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Accountable"
                          color="secondary"
                          error={!!errors?.accountable?.message}
                          helperText={errors?.accountable?.message}
                        />
                      )}
                    />
                  )}
                </Box>

                <Divider />

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    width: "100%",
                    pb: "10px",
                  }}
                >
                  <Typography sx={sxSubtitle}>Attachments</Typography>

                  <CustomAttachment
                    control={control}
                    name="letter_of_request"
                    label="Letter of Request"
                    error={!!errors?.attachment}
                    helperText={errors?.attachment?.message}
                    multiline
                  />

                  <CustomAttachment
                    control={control}
                    name="quotation"
                    label="Quotation"
                    error={!!errors?.attachment}
                    helperText={errors?.attachment?.message}
                    multiline
                  />

                  <CustomAttachment
                    control={control}
                    name="specification"
                    label="Specification (Form)"
                    error={!!errors?.attachment}
                    helperText={errors?.attachment?.message}
                    multiline
                  />

                  <CustomAttachment
                    control={control}
                    name="tool_of_trade"
                    label="Tool of Trade"
                    error={!!errors?.attachment}
                    helperText={errors?.attachment?.message}
                    multiline
                  />

                  <CustomAttachment
                    control={control}
                    name="other_attachment"
                    label="Other Attachments"
                    error={!!errors?.attachment}
                    helperText={errors?.attachment?.message}
                    multiline
                  />
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ pb: 1, mb: 1 }} />

            <Button variant="contained" size="small" fullWidth sx={{ gap: 1 }}>
              <AddToPhotos /> <Typography variant="p">ADD</Typography>
            </Button>
          </Box>

          <Divider orientation="vertical" />

          {/* TABLE */}
          <Box className="request__table">
            <Typography
              color="secondary.main"
              sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
            >
              CURRENT ASSET
              {/* {data.status ? "Edit Requisition" : "Add Requisition"} */}
            </Typography>

            <TableContainer
              className="mcontainer__th-body"
              sx={{ height: "85%" }}
            >
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
                        active={orderBy === `type_of_request_name`}
                        direction={
                          orderBy === `type_of_request_name` ? order : `asc`
                        }
                        onClick={() => onSort(`type_of_request_name`)}
                      >
                        Type of Request
                      </TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel>Reference No.</TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel>Chart of Accounts</TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel>Accountability</TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel>Asset Information</TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel>Quantity</TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel>Cellphone #</TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel>Remarks</TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">
                      <TableSortLabel>Attachments</TableSortLabel>
                    </TableCell>

                    <TableCell className="tbl-cell">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody className="request__table-height">
                  {requestList?.length === 0 ? (
                    <NoRecordsFound />
                  ) : (
                    <>
                      {[...requestList?.data]
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
                              {Moment(data.created_at).format("MMM DD, YYYY")}
                            </TableCell>

                            <TableCell className="tbl-cell ">
                              <ActionMenu
                                // status={data.status}
                                data={data}
                                // onUpdateHandler={onUpdateHandler}
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

            <Stack
              flexDirection="row"
              justifyContent="flex-end"
              gap={2}
              sx={{ pt: "10px" }}
            >
              <LoadingButton
                type="submit"
                variant="contained"
                size="small"
                loading={isUpdateLoading || isPostLoading}
              >
                Create
              </LoadingButton>

              <Button
                type="submit"
                variant="outlined"
                size="small"
                color="secondary"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddRequisition;
