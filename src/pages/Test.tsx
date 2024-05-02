import React, { useState } from "react";
import { IonPage, IonContent, IonButton, IonIcon } from "@ionic/react";
import { Container, Row, Col } from "react-bootstrap";
import { eyeOutline } from "ionicons/icons";
import { Category, DrawingUtils, FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';

import { Camera } from "@mediapipe/camera_utils";

import * as vision from "@mediapipe/tasks-vision";
import SampleTest from "../components/PreTest";
import { useHistory } from "react-router-dom";
import Header from "../components/Header/Header";
import Button from "../components/Button/Button";
import { useLocation } from "react-router-dom";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { MdOutlinePhoneIphone } from "react-icons/md";
import { FaRegLightbulb } from "react-icons/fa";
import { AiFillEyeInvisible } from "react-icons/ai";
import { RiKakaoTalkFill } from "react-icons/ri";
import { TbRulerMeasure } from "react-icons/tb";
import { PiHandTapBold } from "react-icons/pi";
import "./Test.css"

interface LocationState {
  testMode?: string;
  // wearGlasses?: string;
  eyeToExamine?: string;
}

const Test: React.FC = () => {
  const location = useLocation<LocationState>();
  const { testMode, eyeToExamine } = location.state || {};
  const history = useHistory();
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
  const instructions = [
    "Hold your face in front of your webcam and tap/click the screen once or twice for live distance calculations.",
    "Grant access to the webcam if prompted. Face should be parallel/level with camera and environment should be well lit.",
    "If you are testing one eye, cover the eye that is not being tested. Wear glasses if you are looking to see if you need a new prescription.",
    "You will be prompted with five letters at a time. Say the letter and wait for the results.",
    "Ensure you are 14 inches away from the camera for correct testing conditions. End the test when you can no longer read the letters or images clearly or if you cannot get 3/5 correct."
  ];

  const goToSampleTest = () => {
    history.push("/CameraPage", { testMode, eyeToExamine });
  };

  const handleContinue = () => {
    if (currentInstructionIndex < instructions.length - 1) {
      setCurrentInstructionIndex(currentInstructionIndex + 1);
    } else {
      goToSampleTest();
    }
  };

  const toggleInstructionsVisibility = () => {
    setCurrentInstructionIndex(currentInstructionIndex === 0 ? instructions.length - 1 : 0);
  };

  const [activeStep, setActiveStep] = useState(0);
  
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      goToSampleTest();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const steps = [
    {
      label: 'Distance',
      description: `Hold your face in front of your webcam and tap/click the screen once or twice for live distance calculations.`,
      icon: <MdOutlinePhoneIphone />,
    },
    {
      label: 'Well-lit room',
      description: 'Grant access to the webcam if prompted. Face should be parallel/level with camera and environment should be well lit.',
      icon: <FaRegLightbulb />,
    },
    {
      label: 'Cover eye that is not being tested',
      description: `If you are testing one eye, cover the eye that is not being tested. Wear glasses if you are looking to see if you need a new prescription.`,
      icon: 
      <AiFillEyeInvisible />,
    },
    {
      label: 'Say or press the letter that appears',
      description: `You will be prompted with five letters at a time. Say the letter and wait for the results.`,
      icon: <div><RiKakaoTalkFill /><PiHandTapBold /></div>,
    },
    {
      label: 'Ensure you are far enough away',
      description: `Ensure you are 14 inches away from the camera for correct testing conditions. End the test when you can no longer read the letters or images clearly or if you cannot get at least 3 correct.`,
      icon: <TbRulerMeasure />,
    },
  ];

  return (
    <IonPage>
      <Header headerText="Instructions"/>
      <IonContent fullscreen className="ion-padding">
        <Container className="transparentBackground">
          <div style={{display: "flex", justifyContent: "center"}}>
          <Box sx={{ maxWidth: 400}}>
            <Stepper activeStep={activeStep} orientation="vertical" >
              {steps.map((step, index) => (
                <Step key={step.label}>
                  <StepLabel classes = {{label: 'custom-step-label'}}><strong>{step.label}</strong></StepLabel>
                  <StepContent>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Typography className="step-description">{step.description}</Typography>
                      <div style={{ marginLeft: "auto", fontSize: "50px" }}>
                        {step.icon}
                      </div>
                    </div>
                    <Box sx={{ mb: 2 }}>
                      {index !== 0 && (
                        <Button
                          buttonText="Previous"
                          onClickAction={handleBack}
                        />
                      )}                      
                      <Button
                        buttonText={index === steps.length - 1 ? "Start Test" : "Continue"}
                        onClickAction={handleNext}
                      />
                    </Box>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps.length && (
              <Paper square elevation={0} sx={{ p: 3 , bgcolor: 'transparent' }}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button buttonText="Reset" onClickAction={handleReset} />
              </Paper>
            )}
          </Box>
          </div>
          
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default Test;