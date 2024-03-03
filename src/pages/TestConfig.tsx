import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonDatetime,
  IonItem,
  IonLabel,
  IonInput,
  IonModal,
  IonButton,
  IonToggle,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonIcon,
  IonSelect,
  IonSelectOption,
  IonAlert,
} from "@ionic/react";
import { eyeOutline } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import Header from "../components/Header/Header";
import Button from "../components/Button/Button";
import Results from "./Results";
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
      <Header headerText="Personal Configuration"/>
      <IonContent scrollY={false}>
      <IonItem>
          <IonLabel position="stacked">
            <h1 className="question">Letters or Shapes?</h1>
          </IonLabel>
          <IonSelect
            label = "Letters or Shapes?"
            value={testMode}
            placeholder="Select Letters or Shapes"
            onIonChange={(e) => setTestMode(e.detail.value)}
          >
            <IonSelectOption value="Letters">Letters</IonSelectOption>
            <IonSelectOption value="Images">Shapes</IonSelectOption>
          </IonSelect>
        </IonItem>


        <IonItem>
          <IonLabel position="stacked">
            <h1 className="question">Which eye will you be testing?</h1>
          </IonLabel>
          <IonSelect
            label="Which eye will you be testing?"
            value={eyeToExamine}
            placeholder="Select an eye"
            onIonChange={(e) => setEyeToExamine(e.detail.value)}
          >
            <IonSelectOption value="Left Eye">Left Eye</IonSelectOption>
            <IonSelectOption value="Right Eye">Right Eye</IonSelectOption>
            <IonSelectOption value="Both">Both</IonSelectOption>
          </IonSelect>
        </IonItem>
        <div className="padding"></div>
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
