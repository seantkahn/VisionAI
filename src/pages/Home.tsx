import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import "./Home.css";
import { useHistory } from "react-router";
import Button from "../components/Button/Button";

const Home: React.FC = () => {
  const history = useHistory();

  const goToTermsPage = () => {
    history.push("./Terms");
  };

  const goToAbout = () => {
    history.push("./About");
  };

  return (
    <IonPage>
      <IonContent className="container">
        <h1 className="welcome-title">Welcome to the Vision AI App</h1>

        <p className="app-description">
          An Artificial Intelligence Based Near Vision Tester. <br /> Providing
          accurate and reliable at home vision testing.
        </p>
        <Button buttonText="Continue" onClickAction={goToTermsPage} />
        <Button buttonText="About Us" onClickAction={goToAbout} />
      </IonContent>
    </IonPage>
  );
};

export default Home;
