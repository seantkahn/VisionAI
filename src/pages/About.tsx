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
import { Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header/Header";
import Button from "../components/Button/Button";
import Results from "./Results";
import "./TestConfig.css";

const About: React.FC = () => {
  return (
    //fix CSS by giving ionPage a class name.  Like the commented out line below
    // <IonPage id="container">

    <IonPage>
      <Header headerText="About Us"/>
      <IonContent>
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

      </IonContent>
      
    </IonPage>
  );
};

export default About;
