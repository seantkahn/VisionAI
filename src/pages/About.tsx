import React, { useState } from "react";
import {
  IonPage,
  IonContent,
  IonText,
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
        <IonText style={{  }}>
          <h1 style={{fontWeight: "bold", fontSize: "6vh", textAlign: "center"}}>About</h1>
          <div className="about-details">
            <div>
                <h2 style={{fontWeight: "bold", textAlign: "center", textDecoration: "underline", fontStyle: "normal"}}>Made in</h2>
                <h2 style={{textAlign: "center"}}>Pace University<br />CS389 Software Engineering</h2>
            </div>
            <div>
                <h2 style={{fontWeight: "bold", textAlign: "center", textDecoration: "underline", fontStyle: "normal"}}>Created for:</h2>
                <h2 style={{textAlign: "center"}}>Dr. Deep Parikh</h2>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <img src="../../public/the doc.jpg"></img>
                </div>
            </div>
            <div>
                <h2 style={{fontWeight: "bold", textAlign: "center", textDecoration: "underline", fontStyle: "normal"}}>Vision AI Team:</h2>
                <h2 style={{textAlign: "center"}}>Sean Kahn<br />Daniel White<br />Cristian Bolanos<br />Jack Lasko</h2>
            </div>
            <div>
                <h2 style={{fontWeight: "bold", textAlign: "center", textDecoration: "underline", fontStyle: "normal"}}>Acknowledgement:</h2>
                <h2 style={{textAlign: "center", marginLeft: "2vh", marginRight: "2vh"}}> Thank you to Professor Thomas Schmidt for connecting us with Dr. Parikh and for working with us for the whole school year.</h2>
            </div>
            <div>
                <h2 style={{fontWeight: "bold", textAlign: "center", textDecoration: "underline", fontStyle: "normal"}}>Contact:</h2>
                <h2 style={{textAlign: "center", marginLeft: "2vh", marginRight: "2vh"}}>Dr. Parikh: <br /></h2>
            </div>
            
          </div>
        </IonText>

      

      </IonContent>
      
    </IonPage>
  );
};

export default About;
