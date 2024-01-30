import React, { useState } from "react";
import { Box, Stack, TextField, Typography, createFilterOptions } from "@mui/material";
import CustomAutoComplete from "../../../Components/Reusable/CustomAutoComplete";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useGetSedarUsersApiQuery } from "../../../Redux/Query/SedarUserApi";
import { LoadingButton } from "@mui/lab";

const schema = yup.object().shape({
  accountability: yup.string(),
  accountable: yup.string(),
  received_by: yup.string(),
});

const AddReleasingInfo = () => {
  const { handleSubmit, control, watch, errors } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      accountability: "",
      accountable: null,
      received_by: null,
    },
  });

  const {
    data: sedarData = [],
    isLoading: isSedarLoading,
    isSuccess: isSedarSuccess,
    isError: isSedarError,
  } = useGetSedarUsersApiQuery();

  const filterOptions = createFilterOptions({
    limit: 100,
    matchFrom: "any",
  });

  return (
    <Box className="mcontainer">
      <Typography className="mcontainer__title" sx={{ fontFamily: "Anton", fontSize: "1.6rem" }}>
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

        <LoadingButton variant="contained">Release</LoadingButton>
      </Stack>
    </Box>
  );
};

export default AddReleasingInfo;
