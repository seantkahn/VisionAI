import React from "react";
import { IonPage, IonContent } from "@ionic/react";
import PreTest from "../components/PreTest";
import "./CameraPage.css";
import Header from "../components/Header/Header";

const CameraPage: React.FC = () => {
  return (
    <IonPage>
      <Header headerText="Tap Video Output for Distance" />
      <IonContent fullscreen>
        <PreTest />
      </IonContent>
    </IonPage>
  );
};

export default CameraPage;
