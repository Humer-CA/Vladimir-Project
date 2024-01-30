import React, { useEffect, useState } from "react";
import { Box, Button, Stack, TextField, Typography, createFilterOptions } from "@mui/material";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";
import { LoadingButton } from "@mui/lab";
import { closeDialog } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import { usePutAssetReleasingMutation } from "../../../Redux/Query/Request/AssetReleasing";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { Info } from "@mui/icons-material";
import { closeConfirm, onLoading, openConfirm } from "../../../Redux/StateManagement/confirmSlice";

const schema = yup.object().shape({
  warehouse_number_id: yup.array(),
  accountability: yup.string().required().typeError("Accountability is a required field"),
  accountable: yup
    .object()
    .nullable()
    .when("accountability", {
      is: (value) => value === "Personal Issued",
      then: (yup) => yup.label("Accountable").required().typeError("Accountable is a required field"),
    }),
  received_by: yup.object().required().typeError("Received By is a required field"),
});

const AddReleasingInfo = (props) => {
  const { data, refetch } = props;

  const {
    handleSubmit,
    control,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      accountability: null,
      accountable: null,
      received_by: null,
    },
  });

  const dispatch = useDispatch();

  const {
    data: sedarData = [],
    isLoading: isSedarLoading,
    isSuccess: isSedarSuccess,
    isError: isSedarError,
    error: sedarError,
  } = useGetSedarUsersApiQuery();

  const [
    releaseItems,
    { data: postData, isSuccess: isPostSuccess, isLoading: isPostLoading, isError: isPostError, error: postError },
  ] = usePutAssetReleasingMutation();

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

  useEffect(() => {
    if (isPostSuccess) {
      reset();
      handleCloseDialog();
      refetch();
      dispatch(
        openToast({
          message: postData?.message,
          duration: 5000,
        })
      );
    }
  }, [isPostSuccess]);

  const handleCloseDialog = () => {
    dispatch(closeDialog());
  };

  const filterOptions = createFilterOptions({
    limit: 50,
    matchFrom: "any",
  });

  const onVoidReferenceHandler = async (id) => {
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
            this Item?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result = await deleteRequestContainer(id).unwrap();
            // console.log(result);
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

  const onSubmitHandler = (formData) => {
    const newFormData = {
      ...formData,
      warehouse_number_id: [data?.warehouse_number?.id],
      accountable: formData?.accountable?.general_info?.full_id_number_full_name?.toString(),
      received_by: formData?.received_by?.general_info?.full_id_number_full_name?.toString(),
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
              RELEASE
            </Typography>{" "}
            this Item?
          </Box>
        ),

        onConfirm: async () => {
          try {
            dispatch(onLoading());
            let result = await releaseItems(newFormData).unwrap();
            // console.log(result);
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

  console.log(errors);

  return (
    <Box className="mcontainer" component="form" onSubmit={handleSubmit(onSubmitHandler)}>
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "1.6rem", textAlign: "center" }}>
        Releasing
      </Typography>

      <Stack gap={2} pt={2}>
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
            filterOptions={filterOptions}
            options={sedarData}
            loading={isSedarLoading}
            getOptionLabel={(option) => option.general_info?.full_id_number_full_name}
            isOptionEqualToValue={(option, value) =>
              option.general_info?.full_id_number === value.general_info?.full_id_number
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

        <CustomAutoComplete
          autoComplete
          name="received_by"
          control={control}
          filterOptions={filterOptions}
          options={sedarData}
          loading={isSedarLoading}
          size="small"
          getOptionLabel={(option) => option.general_info?.full_id_number_full_name}
          isOptionEqualToValue={(option, value) =>
            option.general_info?.full_id_number === value.general_info?.full_id_number
          }
          renderInput={(params) => (
            <TextField
              color="secondary"
              {...params}
              label="Received By"
              error={!!errors?.received_by}
              helperText={errors?.received_by?.message}
            />
          )}
        />

        <Stack flexDirection="row" alignSelf="flex-end" gap={2}>
          <LoadingButton variant="contained" loading={isPostLoading} size="small" type="submit">
            Release
          </LoadingButton>

          <Button variant="outlined" color="secondary" size="small" onClick={() => dispatch(closeDialog())}>
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AddReleasingInfo;
