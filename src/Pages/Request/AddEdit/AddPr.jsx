import React, { useEffect, useState } from "react";
import "../../../Style/Masterlist/addMasterlist.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { Box, Button, Stack, TextField, Typography } from "@mui/material";

import { closeDialog, closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";

import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";

import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

import {
  useAddPurchaseRequestApiMutation,
  useGetPurchaseRequestAllApiQuery,
} from "../../../Redux/Query/Request/PurchaseRequest";
import { useGetCompanyAllApiQuery } from "../../../Redux/Query/Masterlist/FistoCoa/Company";

const schema = yup.object().shape({
  id: yup.string(),
  pr_number: yup.string().required(),
  business_unit_id: yup.string().required(),
});

const AddPr = (props) => {
  const { data } = props;
  const dispatch = useDispatch();

  const [
    postPr,
    { data: postData, isLoading: isPostLoading, isSuccess: isPostSuccess, isError: isPostError, error: postError },
  ] = useAddPurchaseRequestApiMutation();

  const {
    handleSubmit,
    control,
    formState: { errors },
    setError,
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      id: "",
      pr_number: "",
      business_unit_id: null,
    },
  });

  const { data: companyData = [], isLoading: isCompanyLoading } = useGetCompanyAllApiQuery();

  useEffect(() => {
    if (isPostError && postError?.status === 422) {
      setError("pr_number", {
        type: "validate",
        message: postError?.data?.errors.pr_number,
      }) ||
        setError("business_unit_id", {
          type: "validate",
          message: postError?.data?.errors.business_unit_id,
        });
    } else if (isPostError && postError?.status !== 422) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    }
  }, [isPostError]);

  useEffect(() => {
    if (isPostSuccess) {
      reset();
      handleCloseDialog();
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );

      setTimeout(() => {
        onUpdateResetHandler();
      }, 500);
    }
  }, [isPostSuccess]);

  useEffect(() => {
    if (data) {
      setValue("id", data.id);
      setValue("pr_number", data.pr_number);
      setValue("business_unit_id", data.business_unit_id);
    }
  }, [data]);

  const onSubmitHandler = (formData) => {
    postPr(formData);
  };

  const handleCloseDialog = () => {
    dispatch(closeDialog());
  };

  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  return (
    <Stack width="100%" gap={2}>
      <Typography color="secondary.main" sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}>
        Add PR Number
      </Typography>

      <Stack gap={3} component="form" onSubmit={handleSubmit(onSubmitHandler)}>
        <Stack gap={2}>
          <CustomAutoComplete
            control={control}
            name="business_unit_id"
            loading={isCompanyLoading}
            options={companyData}
            getOptionLabel={(option) => option?.company_name}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            size="small"
            renderInput={(params) => (
              <TextField
                color="secondary"
                {...params}
                label={"Business Unit"}
                error={!!errors?.business_unit_id?.message}
                helperText={errors?.business_unit_id?.message}
              />
            )}
          />

          <CustomTextField
            control={control}
            name="pr_number"
            label="PR Number"
            type="text"
            color="secondary"
            size="small"
            error={!!errors?.pr_number}
            helperText={errors?.pr_number?.message}
            fullWidth
          />
        </Stack>

        <Box className="add-masterlist__buttons">
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isPostLoading}
            disabled={watch("pr_number") === ""}
          >
            {data ? "Update" : "Create"}
          </LoadingButton>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleCloseDialog}
            disabled={isPostLoading === true}
          >
            Cancel
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default AddPr;
