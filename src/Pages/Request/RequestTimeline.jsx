import React from 'react'
import "../../Style/Request/timeline.scss"
import { Box, Stack, Step, StepIcon, StepLabel, Stepper, Typography } from '@mui/material'

const RequestTimeline = () => {

    const steps = [
        '1st Approval',
        '2nd Approval',
        'Inputing of PR No.',
        'Matching of PR No. to Receiving',
        'Asset Tagging',
        'Ready to Pickup',
    ];

    return (
        <Box className='timelineSteps'>
            <Typography fontFamily={"Anton"} color={"secondary.main"} fontSize={20}>PROCESS DETAILS</Typography>

            <Box className='timelineSteps__container'>
                <Stepper activeStep={0} alternativeLabel >
                    {steps.map((label) => (
                        <Step key={label} >
                            <StepLabel >{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>




            <Stack alignItems={'flex-start'} justifyContent={'flex-start'}>
                <Typography fontFamily={"Anton"} color={"secondary.main"} fontSize={20}>TIMELINE</Typography>
                <Stepper activeStep={0} alternativeLabel orientation='vertical'>
                    {steps.map((label) => (
                        <Step key={label} >
                            <StepLabel >{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Stack>

        </Box>
    )
}

export default RequestTimeline