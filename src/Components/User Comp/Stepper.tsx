
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { FC } from 'react';

interface StepCount {
    count : number,
    step:number
}



  const  LabelStepper : FC<StepCount> = ({count,step})=>{
    const steps = Array(step);
    for (let i = 1; i <= step; i++) {
        steps.push(i)     
    }

    
  return (
    <div className='mt-4 ml-18'>
    <Box sx={{ width: '70%' }}>
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