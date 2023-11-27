import React, { useEffect, useRef, useState } from "react";
import "../../../Style/Request/request.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomNumberField from "../../../Components/Reusable/CustomNumberField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import CustomAttachment from "../../../Components/Reusable/CustomAttachment";
import { useGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";
import {
  requestContainerApi,
  useDeleteRequestContainerAllApiMutation,
  useDeleteRequestContainerApiMutation,
} from "../../../Redux/Query/Request/RequestContainer";

import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { openToast } from "../../../Redux/StateManagement/toastSlice";

import {
  Box,
  Button,
  Divider,
  IconButton,
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
import {
  AddToPhotos,
  ArrowBackIosRounded,
  Create,
  Remove,
  Report,
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
import CustomPatternfield from "../../../Components/Reusable/CustomNumberField";
import ActionMenu from "../../../Components/Reusable/ActionMenu";
import {
  useGetRequestContainerAllApiQuery,
  usePostRequestContainerApiMutation,
  useUpdateRequestContainerApiMutation,
} from "../../../Redux/Query/Request/RequestContainer";
import axios from "axios";
import {
  closeConfirm,
  onLoading,
  openConfirm,
} from "../../../Redux/StateManagement/confirmSlice";

const schema = yup.object().shape({
  id: yup.string(),

  type_of_request_id: yup
    .object()
    .required()
    .label("Type of Request")
    .typeError("Type of Request is a required field"),
  attachment_type: yup
    .string()
    .required()
    .label("Attachment Type")
    .typeError("Attachment Type is a required field"),

  // company_id: yup
  //   .string()
  //   .transform((value) => {
  //     return value?.id.toString();
  //   })
  //   .required()
  //   .label("Company"),

  subunit_id: yup
    .object()
    .required()
    .label("Subunit")
    .typeError("Subunit is a required field"),

  department_id: yup
    .object()
    .required()
    .label("Department")
    .typeError("Department is a required field"),

  location_id: yup
    .object()
    .required()
    .label("Location")
    .typeError("Location is a required field"),

  account_title_id: yup
    .object()
    .required()
    .label("Account Title")
    .typeError("Account Title is a required field"),

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

  asset_description: yup.string().required().label("Asset Description"),
  asset_specification: yup.string().required().label("Asset Specification"),
  brand: yup.string().required().label("Brand"),
  quantity: yup.number().required().label("Quantity"),
  cellphone_number: yup.string().nullable().label("Cellphone Number"),
  remarks: yup.string().nullable().label("Remarks"),

  letter_of_request: yup.mixed().label("Letter of Request"),
  quotation: yup.mixed().label("Quotation"),
  specification: yup.mixed().label("Specification"),
  tool_of_trade: yup.mixed().label("Tool of Trade"),
  other_attachments: yup.mixed().label("Other Attachment"),
});

const AddRequisition = (props) => {
  const { data } = props;
  const [updateRequest, setUpdateRequest] = useState({
    id: "",
    type_of_request_id: null,
    attachment_type: null,

    company_id: null,
    department_id: null,
    subunit_id: null,
    location_id: null,
    account_title_id: null,

    asset_description: "",
    asset_specification: "",
    brand: "",
    accountability: null,
    accountable: null,
    cellphone_number: null,
    quantity: 1,
    remarks: "",

    letter_of_request: "",
    quotation: "",
    specification: "",
    tool_of_trade: "",
    other_attachments: "",
  });
  // const [requestList, setRequestList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const isFullWidth = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const LetterOfRequestRef = useRef(null);
  const QuotationRef = useRef(null);
  const SpecificationRef = useRef(null);
  const ToolOfTradeRef = useRef(null);
  const OthersRef = useRef(null);

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
    data: locationData = [],
    isLoading: isLocationLoading,
    isSuccess: isLocationSuccess,
    isError: isLocationError,
    refetch: isLocationRefetch,
  } = useGetLocationAllApiQuery();

  const {
    data: accountTitleData = [],
    isLoading: isAccountTitleLoading,
    isSuccess: isAccountTitleSuccess,
    isError: isAccountTitleError,
    refetch: isAccountTitleRefetch,
  } = useGetAccountTitleAllApiQuery();

  const {
    data: sedarData = [],
    isLoading: isSedarLoading,
    isSuccess: isSedarSuccess,
    isError: isSedarError,
  } = useGetSedarUsersApiQuery();

  // CONTAINER
  const {
    data: addRequestAllApi = [],
    isLoading: isRequestLoading,
    refetch: isRequestRefetch,
  } = useGetRequestContainerAllApiQuery({ refetchOnMountOrArgChange: true });

  const [postRequest, { data: postRequestData }] =
    usePostRequestContainerApiMutation();

  const [upDateRequest, { data: updateRequestData }] =
    useUpdateRequestContainerApiMutation();

  const [deleteRequest, { data: deleteRequestData }] =
    useDeleteRequestContainerApiMutation();

  const [deleteAllRequest, { data: deleteAllRequestData }] =
    useDeleteRequestContainerAllApiMutation();

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
      attachment_type: null,

      company_id: null,
      department_id: null,
      subunit_id: null,
      location_id: null,
      account_title_id: null,

      asset_description: "",
      asset_specification: "",
      brand: "",
      accountability: null,
      accountable: null,
      cellphone_number: null,
      quantity: 1,
      remarks: "",

      letter_of_request: "",
      quotation: "",
      specification: "",
      tool_of_trade: "",
      other_attachments: "",
    },
  });

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

      // setTimeout(() => {
      //   onUpdateResetHandler();
      // }, 500);
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
  const onSubmitHandler = () => {
    if (data.status) {
      updateRequisition(addRequestAllApi);
      return;
    }
    postRequisition(addRequestAllApi);
  };

  const handleCloseDrawer = () => {
    // setTimeout(() => {
    //   onUpdateResetHandler();
    // }, 500);

    dispatch(closeDrawer());
  };

  const filterOptions = createFilterOptions({
    limit: 100,
    matchFrom: "any",
  });

  const attachmentType = ["Budgeted", "Unbudgeted"];

  const RemoveFile = ({ title, value }) => {
    return (
      <Tooltip title={`Remove ${title}`} arrow>
        <IconButton
          onClick={() => {
            setValue(value, "");
            // ref.current.files = [];
          }}
          size="small"
          sx={{
            backgroundColor: "error.main",
            color: "white",
            ":hover": { backgroundColor: "error.main" },
            height: "25px",
            width: "25px",
          }}
        >
          <Remove />
        </IconButton>
      </Tooltip>
    );
  };

  // console.log(errors);
  console.log(addRequestAllApi);

  // Adding of Request
  const addRequestHandler = (formData) => {
    // console.log(formData);

    const data = {
      type_of_request_id: formData?.type_of_request_id?.id?.toString(),
      attachment_type: formData?.attachment_type?.toString(),

      department_id: formData?.department_id.id?.toString(),
      company_id: formData?.department_id?.company?.company_id?.toString(),
      subunit_id: formData.subunit_id.id?.toString(),
      location_id: formData?.location_id.id?.toString(),
      account_title_id: formData?.account_title_id.id?.toString(),
      accountability: formData?.accountability?.toString(),
      accountable:
        formData?.accountable?.general_info?.full_id_number_full_name?.toString(),

      asset_description: formData?.asset_description?.toString(),
      asset_specification: formData?.asset_specification?.toString(),
      cellphone_number: formData?.cellphone_number?.toString(),
      brand: formData?.brand?.toString(),
      quantity: formData?.quantity?.toString(),
      remarks: formData?.remarks?.toString(),

      letter_of_request: formData?.letter_of_request,
      quotation: formData?.quotation,
      specification_form: formData?.specification,
      tool_of_trade: formData?.tool_of_trade,
      other_attachments: formData?.other_attachments,
    };

    const payload = new FormData();
    Object.entries(data).forEach((item) => {
      const [name, value] = item;

      payload.append(name, value);
    });
    const token = localStorage.getItem("token");
    setIsLoading(true);
    axios
      .post("http://127.0.0.1:8000/api/request-container", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          // Authorization: `Bearer 583|KavZ7vEXyUY7FiHQGIMcTImftzyRnZorxbtn4S9a`,
          Authorization: `Bearer ${token}`,
        },
      })
      .then((result) => {
        console.log(result);
        // const data = result.json();
        // return data;
        dispatch(
          openToast({
            message: result?.data?.message || result?.data?.message,
            duration: 5000,
          })
        );
      })
      .then(() => {
        dispatch(requestContainerApi.util.invalidateTags(["RequestContainer"]));
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        dispatch(
          openToast({
            message: err?.data?.message || err?.data?.message,
            duration: 5000,
          })
        );
      })
      .finally((item) => {
        setIsLoading(false);
        reset({
          department_id: item?.department_id,
          subunit_id: item?.subunit_id,
          location_id: item?.location_id,
          account_title_id: item?.account_title_id,
        });
      });

    // postRequest(payload);
    // reset({
    //   department_id: formData?.department_id,
    //   subunit_id: formData?.subunit_id,
    //   location_id: formData?.location_id,
    //   account_title_id: formData?.account_title_id,
    // });
  };

  const sxSubtitle = {
    fontWeight: "bold",
    color: "secondary.main",
    fontFamily: "Anton",
    fontSize: "16px",
  };

  const BoxStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "100%",
    pb: "10px",
  };

  const onUpdateHandler = (props) => {
    const { id, division_name, sync_id } = props;
    setUpdateDivision({
      status: true,
      id: id,
      sync_id: sync_id,
      division_name: division_name,
    });
  };

  const onUpdateResetHandler = () => {
    setUpdateRequest({
      id: "",
      type_of_request_id: null,
      attachment_type: null,

      company_id: null,
      department_id: null,
      subunit_id: null,
      location_id: null,
      account_title_id: null,

      asset_description: "",
      asset_specification: "",
      brand: "",
      accountability: null,
      accountable: null,
      cellphone_number: null,
      quantity: 1,
      remarks: "",

      letter_of_request: "",
      quotation: "",
      specification: "",
      tool_of_trade: "",
      other_attachments: "",
    });
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
            let result = await deleteRequest(id).unwrap();

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
            deleteAllRequest();
          }}
          sx={{ width: "90px", marginLeft: "-15px" }}
        >
          <Typography color="secondary.main">Back</Typography>
        </Button>

        <Box className="request mcontainer__wrapper" p={2}>
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
              id="requestForm"
              className="request__form"
              component="form"
              onSubmit={handleSubmit(addRequestHandler)}
            >
              <Stack gap={2}>
                <Box sx={BoxStyle}>
                  <Typography sx={sxSubtitle}>Request Information</Typography>

                  <CustomAutoComplete
                    disablePortal
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
                    // onChange={(_, value) => {
                    //   setValue("sub_capex_id", null);
                    //   // setValue("project_name", "");
                    //   return value;
                    // }}
                  />

                  <CustomAutoComplete
                    disablePortal
                    control={control}
                    name="attachment_type"
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

                <Box sx={BoxStyle}>
                  <Typography sx={sxSubtitle}>Charging Information</Typography>

                  {/* OLD Departments */}
                  <CustomAutoComplete
                    autoComplete
                    name="department_id"
                    control={control}
                    options={departmentData}
                    loading={isDepartmentLoading}
                    size="small"
                    disabled={addRequestAllApi.length !== 0}
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
                    disablePortal
                    fullWidth
                  />

                  <CustomAutoComplete
                    autoComplete
                    name="subunit_id"
                    control={control}
                    disabled={addRequestAllApi.length !== 0}
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

                  {/* <CustomAutoComplete
            autoComplete
            name="company_id"
            control={control}
            options={companyData}
            loading={isCompanyLoading}
            size="small"
            getOptionLabel={(option) =>
              option.company_code + " - " + option.company_name
            }
            isOptionEqualToValue={(option, value) =>
              option.company_id === value.company_id
            }
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label="Company"
                error={!!errors?.company_id}
                helperText={errors?.company_id?.message}
              />
            )}
            disabled
          /> */}

                  <CustomAutoComplete
                    autoComplete
                    name="location_id"
                    control={control}
                    disabled={addRequestAllApi.length !== 0}
                    options={locationData?.filter((item) => {
                      return item.departments.some((department) => {
                        return (
                          department?.sync_id ===
                          watch("department_id")?.sync_id
                        );
                      });
                    })}
                    loading={isLocationLoading}
                    size="small"
                    getOptionLabel={(option) =>
                      option.location_code + " - " + option.location_name
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.location_id === value.location_id
                    }
                    renderInput={(params) => (
                      <TextField
                        color="secondary"
                        {...params}
                        label="Location"
                        error={!!errors?.location_id}
                        helperText={errors?.location_id?.message}
                      />
                    )}
                  />

                  <CustomAutoComplete
                    name="account_title_id"
                    control={control}
                    disabled={addRequestAllApi.length !== 0}
                    options={accountTitleData}
                    loading={isAccountTitleLoading}
                    size="small"
                    getOptionLabel={(option) =>
                      option.account_title_code +
                      " - " +
                      option.account_title_name
                    }
                    isOptionEqualToValue={(option, value) =>
                      option.account_title_code === value.account_title_code
                    }
                    renderInput={(params) => (
                      <TextField
                        color="secondary"
                        {...params}
                        label="Account Title  "
                        error={!!errors?.account_title_id}
                        helperText={errors?.account_title_id?.message}
                      />
                    )}
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

                <Box sx={BoxStyle}>
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

                  <CustomTextField
                    control={control}
                    name="brand"
                    label="Brand"
                    type="text"
                    color="secondary"
                    size="small"
                    error={!!errors?.brand}
                    helperText={errors?.brand?.message}
                    fullWidth
                  />

                  <CustomNumberField
                    control={control}
                    name="quantity"
                    label="Quantity"
                    type="number"
                    color="secondary"
                    error={!!errors?.quantity}
                    helperText={errors?.quantity?.message}
                    fullWidth
                    isAllowed={(values) => {
                      const { floatValue } = values;
                      return floatValue >= 1;
                    }}
                  />

                  <CustomPatternfield
                    control={control}
                    color="secondary"
                    name="cellphone_number"
                    label="Cellphone # (optional)"
                    type="text"
                    size="small"
                    error={!!errors?.cellphone_number}
                    helperText={errors?.cellphone_number?.message}
                    format="(09##) - ### - ####"
                    valueIsNumericString
                    fullWidth
                  />

                  <CustomTextField
                    control={control}
                    name="remarks"
                    label="Remarks (Optional)"
                    type="text"
                    color="secondary"
                    size="small"
                    fullWidth
                    multiline
                  />
                </Box>

                <Divider />

                <Box sx={BoxStyle}>
                  <Typography sx={sxSubtitle}>Attachments</Typography>
                  <Stack flexDirection="row" gap={1} alignItems="center">
                    <CustomAttachment
                      control={control}
                      name="letter_of_request"
                      label="Letter of Request"
                      inputRef={LetterOfRequestRef}
                    />

                    {watch("letter_of_request") !== "" && (
                      <RemoveFile
                        title="Letter of Request"
                        value="letter_of_request"
                      />
                    )}
                  </Stack>

                  <Stack flexDirection="row" gap={1} alignItems="center">
                    <CustomAttachment
                      control={control}
                      name="quotation"
                      label="Quotation"
                      inputRef={QuotationRef}
                    />
                    {watch("quotation") !== "" ? (
                      <RemoveFile title="Quotation" value="quotation" />
                    ) : (
                      ""
                    )}
                  </Stack>

                  <Stack flexDirection="row" gap={1} alignItems="center">
                    <CustomAttachment
                      control={control}
                      name="specification"
                      label="Specification (Form)"
                      inputRef={SpecificationRef}
                    />
                    {watch("specification") !== "" && (
                      <RemoveFile title="Specification" value="specification" />
                    )}
                  </Stack>

                  <Stack flexDirection="row" gap={1} alignItems="center">
                    <CustomAttachment
                      control={control}
                      name="tool_of_trade"
                      label="Tool of Trade"
                      inputRef={ToolOfTradeRef}
                    />
                    {watch("tool_of_trade") !== "" && (
                      <RemoveFile title="Tool of Trade" value="tool_of_trade" />
                    )}
                  </Stack>

                  <Stack flexDirection="row" gap={1} alignItems="center">
                    <CustomAttachment
                      control={control}
                      name="other_attachments"
                      label="Other Attachments"
                      inputRef={OthersRef}
                    />
                    {watch("other_attachments") !== "" && (
                      <RemoveFile
                        title="Other Attachments"
                        value="other_attachments"
                      />
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ pb: 1, mb: 1 }} />

            <LoadingButton
              loading={isLoading}
              form="requestForm"
              variant="contained"
              type="submit"
              size="small"
              fullWidth
              sx={{ gap: 1 }}
            >
              <AddToPhotos /> <Typography variant="p">ADD</Typography>
            </LoadingButton>
          </Box>

          <Divider orientation="vertical" />

          {/* TABLE */}
          <Box className="request__table">
            <Typography
              color="secondary.main"
              sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
            >
              CURRENT ASSET
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

                    <TableCell className="tbl-cell">
                      Chart of Accounts
                    </TableCell>

                    <TableCell className="tbl-cell">Accountability</TableCell>

                    <TableCell className="tbl-cell">
                      Asset Information
                    </TableCell>

                    <TableCell className="tbl-cell text-center">
                      Quantity
                    </TableCell>

                    <TableCell className="tbl-cell">Cellphone #</TableCell>

                    <TableCell className="tbl-cell">Remarks</TableCell>

                    <TableCell className="tbl-cell">Attachments</TableCell>

                    <TableCell className="tbl-cell">Action</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {addRequestAllApi?.length === 0 ? (
                    <NoRecordsFound />
                  ) : (
                    <>
                      {addRequestAllApi
                        // ?.sort(comparator(order, orderBy))
                        .map((data, index) => (
                          <TableRow
                            key={index}
                            sx={{
                              "&:last-child td, &:last-child th": {
                                borderBottom: 0,
                              },
                            }}
                          >
                            <TableCell className="tbl-cell tr-cen-pad45 text-weight">
                              {index + 1}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              {data.type_of_request?.type_of_request_name}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              {data.attachment_type}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              <Typography fontSize={10} color="gray">
                                {`(${data.company?.company_code}) -
                              ${data.company?.company_name}`}
                              </Typography>

                              <Typography fontSize={10} color="gray">
                                {`(${data.department?.department_code}) -
                              ${data.department?.department_name}`}
                              </Typography>

                              <Typography fontSize={10} color="gray">
                                {`(${data.location?.location_code}) -
                              ${data.location?.location_name}`}
                              </Typography>

                              <Typography fontSize={10} color="gray">
                                {`(${data.account_title?.account_title_code}) -
                              ${data.account_title?.account_title_name}`}
                              </Typography>
                            </TableCell>

                            <TableCell className="tbl-cell">
                              {data.accountability === "Personal Issued" ? (
                                <>
                                  <Box>
                                    {
                                      data?.accountable?.general_info
                                        ?.full_id_number
                                    }
                                  </Box>
                                  <Box>
                                    {data?.accountable?.general_info?.full_name}
                                  </Box>
                                </>
                              ) : (
                                "Common"
                              )}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              <Typography
                                fontWeight={600}
                                fontSize="14px"
                                color="secondary.main"
                              >
                                {data.asset_description}
                              </Typography>
                              <Typography fontSize="12px" color="text.light">
                                {data.asset_specification}
                              </Typography>
                            </TableCell>

                            <TableCell className="tbl-cell text-center">
                              {data.quantity}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              {data.cellphone_number === null
                                ? "-"
                                : data.cellphone_number}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              {data.remarks === null
                                ? "No Remarks"
                                : data.remarks}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              {data?.attachments?.letter_of_request && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize="12px" fontWeight={600}>
                                    Letter of Request:
                                  </Typography>
                                  {
                                    data?.attachments?.letter_of_request
                                      ?.file_name
                                  }
                                </Stack>
                              )}

                              {data?.attachments?.quotation && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize="12px" fontWeight={600}>
                                    Quotation:
                                  </Typography>
                                  {data?.attachments?.quotation?.file_name}
                                </Stack>
                              )}

                              {data?.attachments?.specification_form && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize="12px" fontWeight={600}>
                                    Specification:
                                  </Typography>
                                  {
                                    data?.attachments?.specification_form
                                      ?.file_name
                                  }
                                </Stack>
                              )}

                              {data?.attachments?.tool_of_trade && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize="12px" fontWeight={600}>
                                    Tool of Trade:
                                  </Typography>
                                  {data?.attachments?.tool_of_trade?.file_name}
                                </Stack>
                              )}

                              {data?.attachments?.other_attachments && (
                                <Stack flexDirection="row" gap={1}>
                                  <Typography fontSize="12px" fontWeight={600}>
                                    Other Attachment:
                                  </Typography>
                                  {
                                    data?.attachments?.other_attachments
                                      ?.file_name
                                  }
                                </Stack>
                              )}
                            </TableCell>

                            <TableCell className="tbl-cell">
                              <ActionMenu
                                hideArchive
                                status={data.status}
                                data={data}
                                showDelete={true}
                                onDeleteHandler={onDeleteHandler}
                                onUpdateHandler={onUpdateHandler}
                                onUpdateResetHandler={onUpdateResetHandler}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                    </>
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Buttons */}
            <Stack
              flexDirection="row"
              justifyContent="space-between"
              alignItems={"center"}
            >
              <Typography
                fontFamily="Anton, Impact, Roboto"
                fontSize="18px"
                color="secondary.main"
                sx={{ pt: "10px" }}
              >
                Added : {addRequestAllApi.length} request
              </Typography>

              <Stack
                flexDirection="row"
                justifyContent="flex-end"
                gap={2}
                sx={{ pt: "10px" }}
              >
                <LoadingButton
                  onClick={onSubmitHandler}
                  variant="contained"
                  size="small"
                  color="secondary"
                  startIcon={
                    <Create
                      color={addRequestAllApi.length === 0 ? "gray" : "primary"}
                    />
                  }
                  disabled={addRequestAllApi.length === 0 ? true : false}
                  loading={isPostLoading || isUpdateLoading}
                >
                  <Typography fontSize="14px">Create</Typography>
                </LoadingButton>

                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={() => {
                    navigate(-1);
                    deleteAllRequest();
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddRequisition;
