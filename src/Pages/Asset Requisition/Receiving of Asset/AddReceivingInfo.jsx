import React, { useEffect, useState } from "react";
import "../../../Style/Request/receiving.scss";
import moment from "moment";

// RTK
import { useDispatch, useSelector } from "react-redux";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { openConfirm, closeConfirm, onLoading } from "../../../Redux/StateManagement/confirmSlice";

// MUI
import { Box, Button, Dialog, Divider, IconButton, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useAddAssetReceivingApiMutation } from "../../../Redux/Query/Request/AssetReceiving/AssetReceiving";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import { LoadingButton } from "@mui/lab";
import { Close, Info } from "@mui/icons-material";
import { closeDialog } from "../../../Redux/StateManagement/booleanStateSlice";
import CustomDatePicker from "../../../Components/Reusable/CustomDatePicker";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";
import CustomNumberField from "../../../Components/Reusable/CustomNumberField";
import { useGetSupplierAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Supplier";

const schema = yup.object().shape({
  id: yup.string(),
  po_number: yup.string().required().label("PO Number").typeError("PO Number is a required field"),
  rr_number: yup.string().required().label("RR Number").typeError("RR Number is a required field"),
  supplier_id: yup
    .string()
    .required()
    .transform((value) => {
      return value?.id.toString();
    })
    .label("Supplier")
    .typeError("Supplier is a required field"),
  delivery_date: yup.date().required().label("Delivery Date").typeError("Delivery Date is a required field"),
  quantity_delivered: yup
    .number()
    .required()
    .label("Quantity Delivered")
    .typeError("Quantity Delivered is a required field"),
  unit_price: yup.number().required().label("Unit Price").typeError("AttUnit Price is a required field"),
});

const ReceivingTable = (props) => {
  const { data } = props;
  const isSmallScreen = useMediaQuery("(max-width: 720px)");

  const {
    handleSubmit,
    control,
    formState: { errors, isDirty },
    setError,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      po_number: "",
      rr_number: "",
      supplier_id: null,
      delivery_date: null,
      quantity_delivered: 1,
      unit_price: null,
    },
  });

  const newData = data?.data?.[0];
  const { data: supplierData = [], isLoading: isSupplierLoading } = useGetSupplierAllApiQuery();

  const dispatch = useDispatch();

  // * API'S
  const [addReceivingInfo, { isPostLoading, isPostSuccess, isPostError, error: postError }] =
    useAddAssetReceivingApiMutation();

  // * Success and Error Handler
  useEffect(() => {
    if (isPostSuccess) {
      reset();
      handleCloseDrawer();
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );
    }
  }, [isPostSuccess]);

  useEffect(() => {
    const errorData = isPostError && postError?.status === 422;
    if (errorData) {
      const errors = postError?.data?.errors || {};
      Object.entries(errors).forEach(([name, [message]]) => setError(name, { type: "validate", message }));
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
  }, [isPostError]);

  const onSubmitHandler = (formData) => {
    const newFormData = {
      ...formData,
      id: newData?.id,
      delivery_date: moment(new Date(formData.delivery_date)).format("YYYY-MM-DD"),
    };

    dispatch(
      openConfirm({
        icon: Info,
        iconColor: "info",
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
              RECEIVE
            </Typography>{" "}
            this Data?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            const result = await addReceivingInfo(newFormData).unwrap();

            dispatch(
              openToast({
                message: result.message,
                duration: 5000,
              })
            );

            dispatch(closeDialog());
            dispatch(closeConfirm());
          } catch (err) {
            console.log(err.data.message);
            if (err?.status === 403 || err?.status === 404 || err?.status === 422) {
              dispatch(
                openToast({
                  message: err.data?.message,
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

  watch("supplier_id");

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmitHandler)} sx={{ display: "flex", flexDirection: "column" }}>
        <Stack flexDirection="row" justifyContent="space-between">
          <Typography fontSize="24px" fontFamily="Anton, Impact, Roboto" color="secondary.main">
            PURCHASE ORDER
          </Typography>

          <IconButton onClick={() => dispatch(closeDialog())} sx={{ top: -10, right: -10 }}>
            <Close />
          </IconButton>
        </Stack>

        <Divider />

        <Box className="assetReceiving" px={2} flexWrap={isSmallScreen ? "wrap" : "noWrap"}>
          <Stack gap={2} width={isSmallScreen ? "100%" : "inherit"}>
            <Stack gap={1}>
              <Typography className="assetReceiving__title" fontFamily="Anton, Impact, Roboto">
                Transaction Details
              </Typography>
              <Stack>
                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600}>
                    Transaction Number :
                  </Typography>
                  <Typography fontSize={14}>{newData?.transaction_number}</Typography>
                </Stack>
                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600}>
                    Reference Number :
                  </Typography>
                  <Typography fontSize={14}>{newData?.reference_number}</Typography>
                </Stack>
              </Stack>
            </Stack>

            <Divider />

            <Stack gap={1}>
              <Typography className="assetReceiving__title" fontFamily="Anton, Impact, Roboto">
                Request Information
              </Typography>
              <Stack>
                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600}>
                    PR Number :
                  </Typography>
                  <Typography fontSize={14}>{newData?.pr_number}</Typography>
                </Stack>

                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600} noWrap>
                    Requisitioner :
                  </Typography>
                  <Typography
                    fontSize={14}
                    noWrap
                  >{`(${newData?.requestor?.employee_id}) - ${newData?.requestor?.firstname} ${newData?.requestor?.lastname}`}</Typography>
                </Stack>

                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600} noWrap>
                    Item Description:
                  </Typography>
                  <Typography fontSize={14} noWrap>
                    {newData?.asset_description}
                  </Typography>
                </Stack>

                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600} noWrap>
                    Quantity Ordered:
                  </Typography>
                  <Typography fontSize={14} noWrap>
                    {newData?.quantity}
                  </Typography>
                </Stack>

                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600} noWrap>
                    UOM:
                  </Typography>
                  <Typography fontSize={14}>EACH</Typography>
                </Stack>
              </Stack>
            </Stack>

            <Divider />

            <Stack gap={1}>
              <Typography className="assetReceiving__title" fontFamily="Anton, Impact, Roboto" noWrap>
                Chart of Accounts
              </Typography>
              <Stack>
                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600} noWrap>
                    Company :
                  </Typography>
                  <Typography
                    fontSize={14}
                    noWrap
                  >{`(${newData?.company?.company_code}) - ${newData?.company?.company_name}`}</Typography>
                </Stack>

                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600} noWrap>
                    Department :
                  </Typography>
                  <Typography
                    fontSize={14}
                    noWrap
                  >{`(${newData?.department?.department_code}) - ${newData?.department?.department_name}`}</Typography>
                </Stack>

                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600} noWrap>
                    Location :
                  </Typography>
                  <Typography
                    fontSize={14}
                    noWrap
                  >{`(${newData?.location?.location_code}) - ${newData?.location?.location_name}`}</Typography>
                </Stack>

                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600} noWrap>
                    Account Title :
                  </Typography>
                  <Typography
                    fontSize={14}
                    noWrap
                  >{`(${newData?.account_title?.account_title_code}) - ${newData?.account_title?.account_title_name}`}</Typography>
                </Stack>

                <Stack flexDirection="row" gap={1}>
                  <Typography fontSize={14} fontWeight={600}>
                    Organization :
                  </Typography>
                  <Typography fontSize={14}>
                    {/* {`(${newData?.account_title?.account_title_code}) - ${newData?.account_title?.account_title_name}`} */}
                    Organization
                  </Typography>
                </Stack>
              </Stack>
            </Stack>

            <Divider />
          </Stack>

          <Divider orientation="vertical" variant="middle" flexItem sx={{ ml: "10px" }} />

          <Stack gap={2} pl={2} pt={isSmallScreen ? 2 : 0} width={isSmallScreen ? "100%" : "inherit"}>
            <Typography className="assetReceiving__title" fontFamily="Anton, Impact, Roboto">
              Add Request Information
            </Typography>

            <Box className="assetReceiving__form">
              <CustomTextField
                control={control}
                name="po_number"
                label="PO Number"
                color="secondary"
                type="text"
                size="small"
                error={!!errors?.po_number}
                helperText={errors?.po_number?.message}
              />
              <CustomTextField
                control={control}
                name="rr_number"
                label="Receive Receipt"
                color="secondary"
                type="text"
                size="small"
                error={!!errors?.rr_number}
                helperText={errors?.rr_number?.message}
              />
              <CustomAutoComplete
                autoComplete
                name="supplier_id"
                control={control}
                loading={isSupplierLoading}
                options={supplierData}
                size="small"
                getOptionLabel={(option) => option.supplier_code + " - " + option.supplier_name}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    {...params}
                    label="Supplier"
                    error={!!errors?.supplier_id}
                    helperText={errors?.supplier_id?.message}
                  />
                )}
              />

              <CustomDatePicker
                control={control}
                name="delivery_date"
                label="Delivery Date"
                size="small"
                views={["year", "month", "day"]}
                openTo="year"
                error={!!errors?.delivery_date}
                helperText={errors?.delivery_date?.message}
                maxDate={new Date()}
                reduceAnimations
              />
              <CustomNumberField
                control={control}
                name="quantity_delivered"
                label="Quantity Delivered"
                color="secondary"
                type="number"
                size="small"
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return floatValue >= 1;
                }}
                error={!!errors?.quantity_delivered}
                helperText={errors?.quantity_delivered?.message}
              />
              <CustomNumberField
                autoComplete="off"
                control={control}
                name="unit_price"
                label="Unit Price"
                type="number"
                color="secondary"
                size="small"
                isAllowed={(values) => {
                  const { floatValue } = values;
                  return floatValue >= 1;
                }}
                error={!!errors?.unit_price}
                helperText={errors?.unit_price?.message}
              />

              <LoadingButton type="submit" variant="contained" size="small">
                Receive
              </LoadingButton>
            </Box>
          </Stack>
        </Box>
      </Box>
    </>
  );
};

export default ReceivingTable;
