import React from 'react'
import "../../Style/Request/timeline.scss"
import { Box, Divider, IconButton, Stack, Step, StepIcon, StepLabel, Stepper, TableCell, TableRow, Typography } from '@mui/material'
import { Close, History, ManageHistoryTwoTone, Timeline, TimelineTwoTone } from '@mui/icons-material';
import { closeDialog } from '../../Redux/StateManagement/booleanStateSlice';
import { useDispatch } from 'react-redux';
import NoDataFile from "../../Img/PNG/no-data.png";
import Moment from "moment";

const RequestTimeline = (props) => {
    const { data: transactionData } = props
    const dispatch = useDispatch();

    const steps = [
        '1st Approval',
        '2nd Approval',
        'Inputing of PR No.',
        'Matching of PR No. to Receiving',
        'Asset Tagging',
        'Ready to Pickup',
    ]

    // console.log(transactionData?.history)

    const reversedSteps = transactionData?.history.toReversed().map((item) => item);

    return (
        <Box className='timelineSteps'>
            <IconButton onClick={() => dispatch(closeDialog())} sx={{ position: "absolute", top: 10, right: 10 }}>
                <Close />
            </IconButton>

            <Stack flexDirection="row" alignItems="center" justifyContent="center" gap={1}>
                <ManageHistoryTwoTone color='secondary' fontSize='large' />
                <Typography fontFamily={"Anton"} color={"secondary.main"} fontSize={24}>PROCESS DETAILS</Typography>
            </Stack>

            <Box className='timelineSteps__container' alignItems="flex-start">
                <Stack flexDirection="row" alignItems="center" gap={1} mb={2}>
                    <TimelineTwoTone color='secondary.main' />
                    <Typography fontFamily={"Anton"} color={"primary"} fontSize={20} >TIMELINE</Typography>
                </Stack>
                <Stepper activeStep={transactionData?.process_count - 1} alternativeLabel>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel sx={{ ".MuiStepIcon-root.Mui-completed": { color: "success.light" } }}>
                                <Typography fontSize={10} marginTop="-10px" fontWeight={600} textTransform="uppercase">
                                    {label}
                                </Typography>
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Divider width="100%" sx={{ pt: 0.5, }} />
            </Box>

            <Stack sx={{ mt: -1.5, }} width="100%">
                <Stack flexDirection="row" alignItems="center" justifyContent="center" gap={1} mb={2}>
                    <History color='secondary.main' />
                    <Typography fontFamily={"Anton"} color={"secondary"} fontSize={20} alignSelf="center" >HISTORY</Typography>
                </Stack>

                {transactionData?.history.length === 0 && <Divider width="80%" sx={{ mb: 2, alignSelf: "center", boxShadow: "1px solid black" }} />}

                <Stack alignItems={'flex-start'} justifyContent={'flex-start'} maxHeight="250px" overflow="auto" mb={3}>
                    <Stepper activeStep={transactionData?.history.length} orientation='vertical' direction="up" sx={transactionData?.history.length === 0 ? { paddingLeft: 0, margin: "auto" } : { paddingLeft: "120px", width: "100%" }}>
                        {transactionData?.history.length === 0 ?
                            (
                                <Stack
                                    flexDirection="row"
                                    alignItems="center"
                                    justifyContent="center"
                                    gap="5px"
                                    colSpan={999}
                                >
                                    <img src={NoDataFile} alt="" width="25px" />
                                    <Typography
                                        variant="p"
                                        sx={{
                                            fontFamily: "Anton, Roboto, Helvetica",
                                            color: "secondary.main",
                                            fontSize: "1.2rem",
                                        }}
                                    >
                                        No Data Found
                                    </Typography>
                                </Stack>
                            ) :
                            (transactionData?.history.toReversed().map((item, index) => (
                                <Step key={index}>
                                    <Box position="relative">

                                        {/* Date and Time */}
                                        <Stack className="timelineSteps__dateAndTime" >
                                            <Typography fontSize="12px" color="secondary" fontWeight={500} >
                                                {Moment(transactionData.created_at).format("ll")}
                                            </Typography>
                                            <Typography fontSize="12px" color="gray" marginTop="-2px">
                                                {Moment(transactionData.created_at).format("LT")}
                                            </Typography>
                                        </Stack>

                                        <Box >
                                            <StepLabel>
                                                <Box className="timelineSteps__box" ml={1}>
                                                    <Divider orientation="vertical" sx={{ backgroundColor: "secondary.light", width: "3px", height: "30px", ml: "5px", borderRadius: "20px" }} />
                                                    <Box>
                                                        <Typography fontSize={13} fontWeight={600} textTransform="uppercase">
                                                            {item?.action}
                                                        </Typography>
                                                        <Typography fontSize={12} color="text.light">
                                                            {`(${item?.causer?.employee_id}) - ${item?.causer?.firstname}  ${item?.causer?.lastname}`}
                                                        </Typography>
                                                        <Typography fontSize={13} fontWeight={600} textTransform="uppercase">
                                                            {item?.remarks}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </StepLabel>
                                        </Box>
                                    </Box>
                                </Step>
                            )))}
                    </Stepper>
                </Stack>
            </Stack >

        </Box >
    )
}

export default RequestTimeline