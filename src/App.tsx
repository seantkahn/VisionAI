import { Redirect } from "react-router-dom";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import Terms from "./pages/Terms";


/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import TestConfig from "./pages/TestConfig";
import Test from "./pages/Test";
import Sample from "./components/PreTest";
import PreTest2 from "./components/PreTest2";
import PreTest from "./components/PreTest";
import CameraPage from "./pages/CameraPage";
import LetterTest from "./pages/LetterTest";
import ShapeTest from "./pages/ShapeTest";
import Results from "./pages/Results";
import LetterTest2 from "./pages/LetterTest2";
import ShapeTest2 from "./pages/ShapeTest2";
import Results2 from "./pages/Results2";
import VoiceTest from "./pages/VoiceTest";
import DistanceTest from "./pages/DistanceTest";
import About from "./pages/About";


setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/Home">
          <Home />
        </Route>
        <Route exact path="/">
          <Redirect to="/Home" />
        </Route>
        <Route path="/Terms" component={Terms} exact />
        <Route path="/TestConfig" component={TestConfig} exact />
        <Route path="/Test" component={Test} exact />
        <Route path="/CameraPage" component={CameraPage} exact />
        <Route path="/LetterTest" component={LetterTest} exact />
        <Route path="/ShapeTest" component={ShapeTest} exact />
        <Route path="/Results" component={Results} exact />
        <Route path="/LetterTest2" component={LetterTest2} exact />
        <Route path="/ShapeTest2" component={ShapeTest2} exact />
        <Route path="/Results2" component={Results2} exact />
        <Route path="/DistanceTest" component={DistanceTest} exact />
        <Route path="/About" component={About} exact />

      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;