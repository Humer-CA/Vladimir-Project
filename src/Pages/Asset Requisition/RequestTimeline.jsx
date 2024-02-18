import React from "react";
import "../../Style/Request/timeline.scss";
import {
  Box,
  Divider,
  IconButton,
  Stack,
  Step,
  StepIcon,
  StepLabel,
  Stepper,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import {
  CancelOutlined,
  CheckBox,
  CheckCircleOutlineTwoTone,
  Close,
  Error,
  ErrorOutline,
  FactCheck,
  History,
  ManageHistoryTwoTone,
  Timeline,
  TimelineTwoTone,
} from "@mui/icons-material";
import { closeDialog } from "../../Redux/StateManagement/booleanStateSlice";
import { useDispatch } from "react-redux";
import NoDataFile from "../../Img/PNG/no-data.png";
import Moment from "moment";

const RequestTimeline = (props) => {
  const { data: transactionData } = props;
  const dispatch = useDispatch();

  return (
    <Box className="timelineSteps">
      <IconButton onClick={() => dispatch(closeDialog())} sx={{ position: "absolute", top: 10, right: 10 }}>
        <Close />
      </IconButton>

      <Stack flexDirection="row" alignItems="center" justifyContent="center" gap={1}>
        <ManageHistoryTwoTone color="secondary" fontSize="large" />
        <Typography fontFamily={"Anton, Impact"} color={"secondary.main"} fontSize={24}>
          PROCESS DETAILS{" "}
        </Typography>
      </Stack>

      <Typography color="secondary" fontWeight={600} fontSize={20} alignSelf="center">
        TRANSACTION : {transactionData?.transaction_number}
      </Typography>

      <Stack flexDirection="row" alignItems="center" gap={1}>
        <TimelineTwoTone color="primary" />
        <Typography fontFamily={"Anton, Impact"} color={"secondary"} fontSize={20}>
          TIMELINE
        </Typography>
      </Stack>

      <Box className="timelineSteps__timeline" alignItems="flex-start">
        <Stepper key={1} activeStep={transactionData ? transactionData?.process_count - 1 : 0} alternativeLabel>
          {(transactionData?.status === "Returned"
            ? ["Returned", ...transactionData?.steps]
            : transactionData?.steps
          )?.map((label, index) => (
            <Step key={label} last>
              <StepLabel
                icon={transactionData?.status === "Returned" && index === 0 ? <Error /> : null}
                sx={{
                  ".MuiStepIconRoot.MuiCompleted": "success.main",
                  ".Mui-active": { color: transactionData?.status === "Returned" && index === 0 ? "error.main" : null },
                }}
              >
                <Typography fontSize={10} marginTop="-10px" fontWeight={600} textTransform="uppercase" minWidth={80}>
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Divider width="100%" sx={{ mb: 1.5, width: "90%", alignSelf: "center" }} />

      <Stack sx={{ mt: -1.5 }} width="100%">
        <Stack flexDirection="row" alignItems="center" justifyContent="center" gap={1} mb={2} mt={1}>
          {/* <History color='secondary.main' /> */}
          <Typography fontFamily={"Anton, Impact"} color={"secondary"} fontSize={20}>
            HISTORY
          </Typography>
        </Stack>

        {transactionData?.history.length === 0 && (
          <Divider width="50%" sx={{ mb: 2, alignSelf: "center", boxShadow: "1px solid black" }} />
        )}

        <Stack
          alignItems={"flex-start"}
          justifyContent={"flex-start"}
          maxHeight="250px"
          overflow="auto"
          mb={3}
          sx={
            transactionData?.history.length === 0
              ? { paddingLeft: 0, margin: "auto" }
              : { paddingLeft: "120px", width: "100%" }
          }
        >
          {transactionData?.history.length === 0 ? (
            <Stack flexDirection="row" alignItems="center" justifyContent="center" gap="5px" colSpan={999}>
              <img src={NoDataFile} alt="" width="25px" />
              <Typography
                variant="p"
                sx={{
                  fontFamily: "Anton, Impact, Roboto, Helvetica",
                  color: "secondary.main",
                  fontSize: "1.2rem",
                }}
              >
                No Data Found
              </Typography>
            </Stack>
          ) : (
            transactionData?.history.toReversed().map((item, index) => (
              <Stepper
                key={index}
                // activeStep={transactionData?.history.length === 0 ? 0 : transactionData?.history.length}
                activeStep={transactionData?.history.length}
                orientation="vertical"
                direction="up"
                sx={{ width: "100%" }}
              >
                <Step key={index} last>
                  <Stack position="relative" justifyContent="center" flexDirection="column">
                    {/* Date and Time */}
                    <Stack className="timelineSteps__dateAndTime">
                      <Typography fontSize="12px" color="secondary" fontWeight={600}>
                        {Moment(transactionData.created_at).format("ll")}
                      </Typography>
                      <Typography fontSize="12px" color="gray" marginTop="-2px">
                        {Moment(transactionData.created_at).format("LT")}
                      </Typography>
                    </Stack>

                    {/* <Box> */}
                    <StepLabel
                      icon={
                        item?.action === "Declined" || item?.action === "Returned" ? (
                          <Error sx={{ color: "error.light" }} />
                        ) : item?.action === "Approved" ? (
                          <FactCheck sx={{ color: "success.main" }} />
                        ) : item?.action === "Removed PR Number" ? (
                          <CancelOutlined sx={{ color: "error.main" }} />
                        ) : (
                          <CheckCircleOutlineTwoTone sx={{ color: "secondary.main" }} />
                        )
                      }
                    >
                      <Box
                        className="timelineSteps__box"
                        sx={{
                          backgroundColor:
                            item?.action === "Declined" || item?.action === "Returned"
                              ? "#ff000017"
                              : item?.action === "Approved"
                              ? "#00800016"
                              : item?.action === "Removed PR Number"
                              ? "#ff000017"
                              : "#0088880f",
                        }}
                        ml={1}
                      >
                        <Divider
                          orientation="vertical"
                          sx={{
                            backgroundColor:
                              item?.action === "Declined" || item?.action === "Returned"
                                ? "error.light"
                                : item?.action === "Approved"
                                ? "success.light"
                                : item?.action === "Removed PR Number"
                                ? "error.light"
                                : "secondary.light",
                            width: "3px",
                            height: "30px",
                            ml: "5px",
                            borderRadius: "20px",
                            border: "none",
                          }}
                        />
                        <Box>
                          <Typography fontSize={13} fontWeight={600} textTransform="uppercase">
                            {item?.action}
                          </Typography>
                          <Typography fontSize={12} color="text.light">
                            {`(${item?.causer?.employee_id}) - ${item?.causer?.firstname}  ${item?.causer?.lastname}`}
                          </Typography>
                          <Typography fontSize={12}>{item?.remarks ? `Remarks: ${item?.remarks}` : null}</Typography>
                        </Box>
                      </Box>
                    </StepLabel>
                    {/* </Box> */}
                    <Divider
                      sx={{
                        position: "absolute",
                        inset: 0,
                        margin: "auto",
                        ml: "-100%",
                        borderColor: "background.light",
                      }}
                    />
                  </Stack>
                </Step>
              </Stepper>
            ))
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default RequestTimeline;
