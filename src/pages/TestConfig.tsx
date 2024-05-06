import React, { useState } from "react";
import { IonPage, IonContent, IonAlert } from "@ionic/react";
import { useHistory } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import Header from "../components/Header/Header";
import Button from "../components/Button/Button";
import "./TestConfig.css";

const TestConfig: React.FC = () => {
  const history = useHistory();
  const [testMode, setTestMode] = useState("");
  // const [wearGlasses, setWearGlasses] = useState<string>("");
  const [eyeToExamine, setEyeToExamine] = useState<string>("");
  const [showAlert, setShowAlert] = useState(false);

  const continueToPreTest = () => {
    if (!testMode || !eyeToExamine) {
      setShowAlert(true);
    } else {
      history.push("/Test", { testMode, eyeToExamine });
    }
  };

  return (
    //fix CSS by giving ionPage a class name.  Like the commented out line below
    // <IonPage id="container">

    <IonPage>
      <Header headerText="Personal Configuration" />
      <IonContent>
        <div className="question">
          <h1>Test with Letters or Images?</h1>
        </div>
        <div className="question-options">
          <Row>
            <Col>
              <button
                onClick={() => setTestMode("Letters")}
                className={testMode === "Letters" ? "active" : ""}
              >
                <h1>Letters</h1>
              </button>
            </Col>
            <Col>
              <button
                onClick={() => setTestMode("Images")}
                className={testMode === "Images" ? "active" : ""}
              >
                <h1>Images</h1>
              </button>
            </Col>
          </Row>
        </div>

        <div className="question">
          <h1>Which Eye Are You Testing?</h1>
        </div>
        <div className="question-options">
          <Row>
            <Col>
              <button
                onClick={() => setEyeToExamine("Left")}
                className={eyeToExamine === "Left" ? "active" : ""}
              >
                <h1>Left</h1>
              </button>
            </Col>
            <Col>
              <button
                onClick={() => setEyeToExamine("Both")}
                className={eyeToExamine === "Both" ? "active" : ""}
              >
                <h1>Both</h1>
              </button>
            </Col>
            <Col>
              <button
                onClick={() => setEyeToExamine("Right")}
                className={eyeToExamine === "Right" ? "active" : ""}
              >
                <h1>Right</h1>
              </button>
            </Col>
          </Row>
        </div>

        {/* OLD WAY OF DOING BUTTONS LEAVING HERE UNTIL CERTAIN NEW WAY WORKS */}

        {/* <IonItem>
          <IonLabel position="stacked">
           
          </IonLabel>
          <IonSelect
            label = "Letters or Images?"
            value={testMode}
            placeholder="Select Letters or Images"
            onIonChange={(e) => setTestMode(e.detail.value)}
          >
            <IonSelectOption value="Letters">Letters</IonSelectOption>
            <IonSelectOption value="Images">Images</IonSelectOption>
          </IonSelect>
        </IonItem> */}

        {/* <IonItem>
          <IonLabel position="stacked">
            
          </IonLabel>
          <IonSelect
            label="Which eye?"
            value={eyeToExamine}
            placeholder="Select an eye"
            onIonChange={(e) => setEyeToExamine(e.detail.value)}
          >
            <IonSelectOption value="Left Eye">Left Eye</IonSelectOption>
            <IonSelectOption value="Right Eye">Right Eye</IonSelectOption>
            <IonSelectOption value="Both">Both</IonSelectOption>
          </IonSelect>
        </IonItem> */}
        <div className="padding"></div>
        <br />
        <br />
        <br />
        <br />

        <br />
        <br />
        <Button buttonText="Continue" onClickAction={continueToPreTest} />

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Incomplete Information"
          message="Please fill in all the fields before continuing."
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default TestConfig;
