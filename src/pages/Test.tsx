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

  return (
    <IonPage>
      <Header headerText="Instructions"/>
      <IonContent fullscreen className="ion-padding" scrollY={false}>
        <Container>
          <div className="instructions-container">
            {instructions.slice(0, currentInstructionIndex + 1).map((instruction, index) => (
              <div>
                 <p key={index} className={`instructions-text ${index < currentInstructionIndex ? '' : 'hidden'}`}>
                {instruction}
              </p>
              </div>
             
            ))}
          </div>
          <Button buttonText={currentInstructionIndex < instructions.length - 1 ? "Continue" : "Start Test"} onClickAction={handleContinue}/>
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default Test;