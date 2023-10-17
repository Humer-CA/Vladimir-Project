import React, { useEffect, useState } from "react";
import "../../../Style/User Management/AddRole.scss";
import CustomTextField from "../../../Components/Reusable/CustomTextField";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Stack,
  Typography,
} from "@mui/material";

import { closeDrawer } from "../../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import {
  usePostRoleApiMutation,
  useUpdateRoleApiMutation,
} from "../../../Redux/Query/UserManagement/RoleManagementApi";
import { openToast } from "../../../Redux/StateManagement/toastSlice";
import { LoadingButton } from "@mui/lab";

const schema = yup.object().shape({
  id: yup.string(),
  role_name: yup.string().required(),
  access_permission: yup.array().required(),
});

const AddRole = (props) => {
  const { data, onUpdateResetHandler } = props;

  const [masterlistChecked, setMasterlistChecked] = useState(false);

  const dispatch = useDispatch();

  const [
    postRole,
    {
      data: postData,
      isLoading: isPostLoading,
      isSuccess: isPostSuccess,
      isError: isPostError,
      error: postError,
    },
  ] = usePostRoleApiMutation();

  const [
    updateRole,
    {
      isLoading: isUpdateLoading,
      isSuccess: isUpdateSuccess,
      data: updateData,
      isError: isUpdateError,
      error: updateError,
    },
  ] = useUpdateRoleApiMutation();

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
      role_name: "",
      access_permission: [],
    },
  });
  // console.log(watch("access_permission").length);
  // console.log(watch("access_permission"));

  useEffect(() => {
    if (
      (isPostError || isUpdateError) &&
      (postError?.status === 422 || updateError?.status === 422)
    ) {
      setError("role_name", {
        type: "validate",
        message:
          postError?.data?.errors.role_name ||
          updateError?.data?.errors.role_name,
      });
    } else if (
      (isPostError && postError?.status !== 422) ||
      (isUpdateError && updateError?.status !== 422)
    ) {
      dispatch(
        openToast({
          message: "Something went wrong. Please try again.",
          duration: 5000,
          variant: "error",
        })
      );
    }
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

  useEffect(() => {
    if (data.status) {
      setValue("id", data.id);
      setValue("role_name", data.role_name);
      setValue("access_permission", data.access_permission);

      // console.log(watch("access_permission"));
    }
  }, [data]);

  // useEffect(() => {
  //   if (!getValues("access_permission")?.includes("masterlist")) {
  //     // const includeMasterlist = watch("access_permission").some((perm) =>
  //     //   masterlistValue.includes(perm)
  //     // );
  //     // if (includeMasterlist) {
  //     //   setValue("access_permission", [
  //     //     ...watch("access_permission"),
  //     //     "masterlist",
  //     //   ]);d
  //     // }
  //     console.log("aaaaaaaaaaaaaa");
  //   }
  // }, [getValues("access_permission")]);

  // useEffect(() => {
  //   const isMasterlistChecked =
  //     watch("access_permission").includes("masterlist");
  //   if (!isMasterlistChecked && watch("access_permission").length) {
  //     const masterlistEmptyValue = watch("access_permission").filter(
  //       (perm) => !masterlistValue.includes(perm)
  //     );

  //     setValue("access_permission", masterlistEmptyValue);
  //   }
  //   console.log("askjdhajskhdjsa");
  // }, [watch("access_permission")]);

  const onSubmitHandler = (formData) => {
    if (data.status) {
      updateRole(formData);
      return;
    }
    postRole(formData);
  };

  const handleCloseDrawer = () => {
    setTimeout(() => {
      onUpdateResetHandler();
    }, 500);

    dispatch(closeDrawer());
  };

  const Children = () => {
    return (
      <Box sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Dashboard"
            value="dashboard"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("dashboard")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Masterlist"
            value="masterlist"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("masterlist")}
                // onChange={(e) => {
                //   if (e.target.checked) {
                //     setValue("access_permission", [
                //       ...watch("access_permission"),
                //       "masterlist",
                //     ]);
                //   } else {
                //     const masterlistEmptyValue = watch(
                //       "access_permission"
                //     ).filter((perm) => !masterlistValue.includes(perm));

                //     setValue("access_permission", masterlistEmptyValue);
                //   }
                // }}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="User Management"
            value="user-management"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes(
                  "user-management"
                )}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Fixed Assets"
            value="fixed-assets"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("fixed-assets")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Printing of Tag"
            value="print-fa"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("print-fa")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Settings"
            value="settings"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("settings")}
              />
            }
          />
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
          <FormControlLabel
            disabled={data.action === "view"}
            label="Request"
            value="request"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("request")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Asset for Tagging"
            value="asset-for-tagging"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes(
                  "asset-for-tagging"
                )}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Asset List"
            value="asset-list"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("asset-list")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="On Hand"
            value="on-hand"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("on-hand")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Disposal"
            value="disposal"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("disposal")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Reports"
            value="reports"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("reports")}
              />
            }
          />
        </Box>
      </Box>
    );
  };

  const Masterlist = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap">
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: 2,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Company"
            value="company"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("company")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Department"
            value="department"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("department")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Location"
            value="location"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("location")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Account Title"
            value="account-title"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("account-title")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Division"
            value="division"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("division")}
              />
            }
          />
        </FormGroup>

        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: 2,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Type of Request"
            value="type-of-request"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes(
                  "type-of-request"
                )}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Capex"
            value="capex"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("capex")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Category"
            value="category"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("category")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Status Category"
            value="status-category"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes(
                  "status-category"
                )}
              />
            }
          />
        </FormGroup>
      </Stack>
    );
  };

  const UserManagement = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap">
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: 2,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="User Accounts"
            value="user-accounts"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("user-accounts")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Role Management"
            value="role-management"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes(
                  "role-management"
                )}
              />
            }
          />
        </FormGroup>
      </Stack>
    );
  };

  const Settings = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap">
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            mx: 2,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Approver Settings"
            value="approver-settings"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes(
                  "approver-settings"
                )}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Form Settings"
            value="form-settings"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("form-settings")}
              />
            }
          />
        </FormGroup>
      </Stack>
    );
  };

  const Request = () => {
    return (
      <Stack flexDirection="row" flexWrap="wrap">
        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Acquisition"
            value="acquisition"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("acquisition")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Transfer"
            value="transfer"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("transfer")}
              />
            }
          />
        </FormGroup>

        <FormGroup
          sx={{
            display: "flex",
            flexDirection: "column",
            ml: 3,
          }}
        >
          <FormControlLabel
            disabled={data.action === "view"}
            label="Pull Out"
            value="pull-out"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("pull-out")}
              />
            }
          />

          <FormControlLabel
            disabled={data.action === "view"}
            label="Disposal"
            value="disposal"
            control={
              <Checkbox
                {...register("access_permission")}
                checked={watch("access_permission")?.includes("disposal")}
              />
            }
          />
        </FormGroup>
      </Stack>
    );
  };

  const permissions = [
    // List of permissions
    "dashboard",
    "masterlist",
    "user-management",
    "fixed-assets",
    "print-fa",
    "settings",
    "request",
    "asset-for-tagging",
    "asset-list",
    "on-hand",
    "disposal",
    "reports",

    // COA
    "company",
    "department",
    "location",
    "account-title",

    "division",
    "type-of-request",
    "capex",
    "category",
    "status-category",

    // UserManagement
    "user-accounts",
    "role-management",

    // Settings
    "approver-settings",
    "form-settings",

    // Request
    "acquisition",
    "transfer",
    "pull-out",
    "disposal",
  ];

  const masterlistValue = [
    "company",
    "department",
    "location",
    "account-title",
    "division",
    "type-of-request",
    "capex",
    "category",
    "status-category",
  ];

  const userManagement = ["user-accounts", "role-management"];

  const settings = ["approver-settings", "form-settings"];

  const request = ["acquisition", "transfer", "pull-out", "disposal"];

  // console.log(watch("access_permission"));

  return (
    <Box className="add-role">
      <Typography
        color="secondary.main"
        sx={{ fontFamily: "Anton", fontSize: "1.5rem" }}
      >
        {!data.status
          ? "Add Role"
          : data.action === "view"
          ? "Permissions"
          : "Edit Role"}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitHandler)}
        sx={{ mx: "10px" }}
      >
        <CustomTextField
          className="add-role__textfield"
          required
          control={control}
          inputProps={{ readOnly: data.action === "view" }}
          name="role_name"
          label="Role Name"
          type="text"
          color="secondary"
          size="small"
          error={!!errors?.role_name?.message}
          helperText={errors?.role_name?.message}
          fullWidth
        />

        <Box className="add-role__container">
          <Stack>
            <FormControl
              fullWidth
              component="fieldset"
              className="add-role__wrapper"
              sx={{
                border: "1px solid #a6a6a6",
                borderRadius: "10px",
                px: "10px",
              }}
            >
              <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                <FormControlLabel
                  sx={{ color: "text.main", fontWeight: "bold" }}
                  label={
                    !data.status
                      ? "Select Role"
                      : data.action === "view"
                      ? "Selected Role"
                      : "Select Roles"
                  }
                  value="parent"
                  disabled={data.action === "view"}
                  control={
                    <Checkbox
                      checked={
                        watch("access_permission")?.length ? true : false
                      }
                      indeterminate={
                        watch("access_permission")?.length === 16
                          ? false
                          : watch("access_permission")?.length >= 1 &&
                            watch("access_permission")?.length < 15
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setValue("access_permission", permissions);
                        } else {
                          setValue("access_permission", []);
                        }
                      }}
                    />
                  }
                />
              </FormLabel>

              <Children />

              {watch("access_permission").includes("masterlist") && (
                <Box>
                  <Divider sx={{ mx: "30px" }} />
                  <FormControl
                    fullWidth
                    component="fieldset"
                    sx={{
                      border: "1px solid #a6a6a6af ",
                      borderRadius: "10px",
                      px: "10px",
                      mt: "10px",
                      mb: "15px",
                    }}
                  >
                    <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                      <FormControlLabel
                        label="Masterlist"
                        value="masterlist"
                        sx={{ color: "text.main", fontWeight: "bold" }}
                        disabled={data.action === "view"}
                        control={
                          <Checkbox
                            checked={watch("access_permission").includes(
                              "masterlist"
                            )}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              masterlistValue.some((perm) =>
                                watch("access_permission").includes(perm)
                              ) &&
                              !masterlistValue.every((perm) =>
                                watch("access_permission").includes(perm)
                              )
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([
                                    ...watch("access_permission"),
                                    "masterlist",
                                    "company",
                                    "department",
                                    "location",
                                    "account-title",
                                    "division",
                                    "type-of-request",
                                    "capex",
                                    "category",
                                    "status-category",
                                  ]),
                                ]);
                              } else {
                                const masterlistEmptyValue = watch(
                                  "access_permission"
                                ).filter(
                                  (perm) =>
                                    ![
                                      ...masterlistValue,
                                      "masterlist",
                                    ].includes(perm)
                                );

                                setValue(
                                  "access_permission",
                                  masterlistEmptyValue
                                );
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <Masterlist />
                  </FormControl>
                </Box>
              )}

              {watch("access_permission").includes("user-management") && (
                <Box>
                  <Divider sx={{ mx: "30px" }} />
                  <FormControl
                    fullWidth
                    component="fieldset"
                    sx={{
                      border: "1px solid #a6a6a6af ",
                      borderRadius: "10px",
                      px: "10px",
                      mt: "10px",
                      mb: "15px",
                    }}
                  >
                    <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                      <FormControlLabel
                        label="User Management"
                        value="user-management"
                        sx={{ color: "text.main", fontWeight: "bold" }}
                        disabled={data.action === "view"}
                        control={
                          <Checkbox
                            checked={watch("access_permission").includes(
                              "user-management"
                            )}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              userManagement.some((perm) =>
                                watch("access_permission").includes(perm)
                              ) &&
                              !userManagement.every((perm) =>
                                watch("access_permission").includes(perm)
                              )
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([
                                    ...watch("access_permission"),
                                    "user-accounts",
                                    "role-management",
                                  ]),
                                ]);
                              } else {
                                const userEmptyValue = watch(
                                  "access_permission"
                                ).filter(
                                  (perm) =>
                                    ![
                                      ...userManagement,
                                      "user-management",
                                    ].includes(perm)
                                );

                                setValue("access_permission", userEmptyValue);
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <UserManagement />
                  </FormControl>
                </Box>
              )}

              {watch("access_permission").includes("settings") && (
                <Box>
                  <Divider sx={{ mx: "30px" }} />
                  <FormControl
                    fullWidth
                    component="fieldset"
                    sx={{
                      border: "1px solid #a6a6a6af ",
                      borderRadius: "10px",
                      px: "10px",
                      mt: "10px",
                      mb: "15px",
                    }}
                  >
                    <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                      <FormControlLabel
                        label="Settings"
                        value="settings"
                        sx={{ color: "text.main", fontWeight: "bold" }}
                        disabled={data.action === "view"}
                        control={
                          <Checkbox
                            checked={watch("access_permission").includes(
                              "settings"
                            )}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              settings.some((perm) =>
                                watch("access_permission").includes(perm)
                              ) &&
                              !settings.every((perm) =>
                                watch("access_permission").includes(perm)
                              )
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([
                                    ...watch("access_permission"),
                                    "approver-settings",
                                    "form-settings",
                                  ]),
                                ]);
                              } else {
                                const settingsEmptyValue = watch(
                                  "access_permission"
                                ).filter(
                                  (perm) =>
                                    ![...settings, "settings"].includes(perm)
                                );

                                setValue(
                                  "access_permission",
                                  settingsEmptyValue
                                );
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <Settings />
                  </FormControl>
                </Box>
              )}

              {watch("access_permission").includes("request") && (
                <Box>
                  <Divider sx={{ mx: "30px" }} />
                  <FormControl
                    fullWidth
                    component="fieldset"
                    sx={{
                      border: "1px solid #a6a6a6af ",
                      borderRadius: "10px",
                      px: "10px",
                      mt: "10px",
                      mb: "15px",
                    }}
                  >
                    <FormLabel component="legend" sx={{ ml: "1px", pl: "5px" }}>
                      <FormControlLabel
                        label="Request"
                        value="request"
                        sx={{ color: "text.main", fontWeight: "bold" }}
                        disabled={data.action === "view"}
                        control={
                          <Checkbox
                            checked={watch("access_permission").includes(
                              "request"
                            )}
                            // checked={masterlistValue.every((perm) =>
                            //   watch("access_permission").includes(perm)
                            // )}
                            indeterminate={
                              request.some((perm) =>
                                watch("access_permission").includes(perm)
                              ) &&
                              !request.every((perm) =>
                                watch("access_permission").includes(perm)
                              )
                            }
                            onChange={(e) => {
                              if (e.target.checked) {
                                setValue("access_permission", [
                                  ...new Set([
                                    ...watch("access_permission"),
                                    "acquisition",
                                    "transfer",
                                    "pull-out",
                                    "disposal",
                                  ]),
                                ]);
                              } else {
                                const requestEmptyValue = watch(
                                  "access_permission"
                                ).filter(
                                  (perm) =>
                                    ![...request, "request"].includes(perm)
                                );

                                setValue(
                                  "access_permission",
                                  requestEmptyValue
                                );
                              }
                            }}
                          />
                        }
                      />
                    </FormLabel>
                    <Request />
                  </FormControl>
                </Box>
              )}
            </FormControl>
          </Stack>
        </Box>

        <Divider sx={{ pb: "15px" }} />

        <Stack
          flexDirection="row"
          justifyContent="flex-end"
          gap="20px"
          sx={{ pt: "15px" }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            size="small"
            loading={isUpdateLoading || isPostLoading}
            disabled={
              (errors?.role_name ? true : false) ||
              watch("role_name") === undefined ||
              watch("role_name") === "" ||
              watch("access_permission")?.length === 0 ||
              data.action === "view"
            }
            sx={data.action === "view" ? { display: "none" } : null}
          >
            {!data.status ? "Create" : "Update"}
          </LoadingButton>

          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleCloseDrawer}
            disabled={(isPostLoading || isUpdateLoading) === true}
          >
            {!data.status
              ? "Cancel"
              : data.action === "view"
              ? "Close"
              : "Cancel"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AddRole;
