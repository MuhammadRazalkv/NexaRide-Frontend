
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { FC } from 'react';

interface StepCount {
    count : number,
    step:number,
    className?:string
    cWidth?:string
}



  const  LabelStepper : FC<StepCount> = ({count,step,className , cWidth})=>{
    const steps = Array(step);
    for (let i = 1; i <= step; i++) {
        steps.push(i)     
    }
    const width = cWidth ? cWidth : '70%'
    
  return (
    <div className={`${className} mt-4 ml-18`}>
    <Box sx={{ width: width }}>
      <Stepper activeStep={count} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel></StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
    </div>

  );
}

export default LabelStepper