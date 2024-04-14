import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonContent,
  IonPage,
  IonButton,
  IonText,
  IonIcon,
} from "@ionic/react";
import Header from "../components/Header/Header";
import { eyeOutline } from "ionicons/icons";
import { useLocation } from "react-router-dom";
import html2canvas from "html2canvas";
import { Container, Row, Col } from "react-bootstrap";
import "./Results.css";

interface LocationState {
  testMode?: string;
  eyeToExamine?: string;
  eyeStrength?: string;
  diopterResult?: string;
}
const diopters = [0.00, 0.5, 1.00, 1.50, 2.00, 2.75, 4.00, 6.00];
//const diopters = [0.00, -0.25, -0.50, -0.75, -1.00, -1.25, -1.50, -2.50];
const eyeStrengthValues = ['20/20', '20/25', '20/30', '20/40', '20/50', '20/70', '20/100', '20/200'];

const Results: React.FC = () => {
  const location = useLocation<LocationState>();
  const { testMode, eyeToExamine, eyeStrength } = location.state || {};
  const history = useHistory();
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  
  // Function to get the corresponding diopter for a given eye strength
  const getDiopterResult = (eyeStrength: string) => {
    const index = eyeStrengthValues.indexOf(eyeStrength);
    return index !== -1 ? diopters[index].toFixed(2) : null;
  };
  const [diopterResult, setDiopterResult] = useState<string | null>(null);
  useEffect(() => {
    if (eyeStrength) {
      const result = getDiopterResult(eyeStrength);
      setDiopterResult(result !== null ? result.toString() : "N/A");
    }
  }, [eyeStrength]);

  const takeAndSaveScreenshot = async () => {
    try {
      const content = document.getElementById("screenshot-content");
      if (content) {
        const canvas = await html2canvas(content);
        const imageData = canvas.toDataURL("image/png");
        console.log('Screenshot taken', imageData);

        // Set the screenshot data in the state
        setScreenshotData(imageData);

        // Save the screenshot
        const link = document.createElement('a');
        link.href = imageData;
        link.download = 'screenshot.png';
        link.click();
      } else {
        console.error("Screenshot content not found");
      }
    } catch (e) {
      console.error('Error taking or saving screenshot', e);
    }
  };
  const handleFineTunePrescription = () => {
    if (testMode === "Letters") {
      history.push("/LetterTest2", { testMode, eyeToExamine, eyeStrength, diopterResult });
    } else if (testMode === "Images") {
      history.push("/ShapeTest2", { testMode, eyeToExamine, eyeStrength, diopterResult });
    }  };
  return (
    <IonPage>
      <Header headerText="Results" />
      <IonContent className="ion-padding" scrollY={false}>
        <div className="results-container">
          <div className="screenshot" id="screenshot-content">
            <div className="box-container">
              <div className="result-box">
                <h1>{testMode}</h1>
                <div className="top-left-text">Test Mode:</div>
              </div>
              <div className="result-box">
                <h1>{eyeToExamine}</h1>
                <div className="top-left-text">Eye Tested:</div>
              </div>
              <div className="result-box">
                <h1>{eyeStrength}</h1>
                <div className="top-left-text">Eye Strength:</div>
              </div>
              <div className="result-box">
                <h1>+{diopterResult}</h1>
                <div className="top-left-text">Recommended<br/>Diopter:</div>
              </div>
            </div>

        
            {/* <h1>Test Mode: {testMode} </h1>
            <h1>Eye Tested: {eyeToExamine} </h1>
            <h1>Eye Strength: {eyeStrength}</h1>
            <h1>Recommended Diopter (Glasses): +{diopterResult}</h1> */}
            {/* <h3>What does it mean if I cannot see 20/20 in each eye?<br/>
   + You may need an updated glasses prescription or reading glasses.<br/>
   + You may have an eye problem that requires the attention of your doctor.</h3>
<h4>While these results can help you gauge your current visul acuity and changes over time, <br/>they are not a substitute for a comprehensive eye-exam performed by a trained and licensed Opthalmologist</h4> */}
          </div>
          <div className="fine-tune-button-container">
          <div></div>
            {eyeStrength !== '20/20' && (
              <button className="result-button" onClick={handleFineTunePrescription}>
                <h1>Fine Tune Prescription Furhter?</h1>
              </button>
            )}
            </div>
          <div className="result-button-container">
            <button className="result-button" onClick={takeAndSaveScreenshot}>
              <h1>Save as Image</h1>
              <IonIcon className="eye" slot="end" size="large" icon={eyeOutline}></IonIcon>
            </button>
            
          </div>
        </div>
       
      </IonContent>
    </IonPage>
  );
};

export default Results;