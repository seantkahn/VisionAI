import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IonContent, IonPage, IonButton, IonText, IonIcon } from "@ionic/react";
import Header from "../components/Header/Header";
import { useLocation } from "react-router-dom";
import { PiButterflyLight } from "react-icons/pi";
import { CiApple } from "react-icons/ci";
import { GiSittingDog } from "react-icons/gi";
import { PiBirdBold } from "react-icons/pi";
import { FaCat, FaHorse, FaCarSide } from "react-icons/fa";
import { FaSailboat } from "react-icons/fa6";
import { WiTrain } from "react-icons/wi";
import { eyeOutline } from "ionicons/icons";
import Button from "../components/Button/Button";
import "./ShapeTest.css";

interface LocationState {
  testMode?: string;
  eyeToExamine?: string;
  eyeStrength?: string;
  diopterResult?: number;
  eyeStrengthIndex?: number;  

}

function getDynamicFontSize(physicalSizeMm: any) {
  function getDevicePixelRatio() {
    if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
      return window.screen.systemXDPI / window.screen.logicalXDPI;} 
    if (window.devicePixelRatio !== undefined) {
      return window.devicePixelRatio;
    }
    return 1;
}

  let physicalSizeInches = physicalSizeMm / 25.4;
  let basePpi = 96;
  let effectivePpi = basePpi * getDevicePixelRatio();
  return physicalSizeInches * effectivePpi;
}

const generateRandomString = () => {
  const icons = [
    { icon: <CiApple />, keyword: "apple" },
    { icon: <PiBirdBold />, keyword: "bird" },
    { icon: <FaSailboat />, keyword: "boat" },
    { icon: <PiButterflyLight />, keyword: "butterfly" },
    { icon: <FaCarSide />, keyword: "car" },
    { icon: <GiSittingDog />, keyword: "dog" },
    { icon: <FaCat />, keyword: "cat" },
    { icon: <FaHorse />, keyword: "horse" },
    { icon: <WiTrain />, keyword: "train" },
  ];

  let randomString = [];
  let usedKeywords = new Set();

  while (randomString.length < 5) {
    const randomIndex = Math.floor(Math.random() * icons.length);
    const selectedIcon = icons[randomIndex];

    if (!usedKeywords.has(selectedIcon.keyword)) {
      usedKeywords.add(selectedIcon.keyword);
      randomString.push({ icon: selectedIcon.icon, keyword: selectedIcon.keyword, recognized: false });
    }
  }

  return randomString;
};


const ShapeTest2: React.FC = () => {
  const location = useLocation<LocationState>();
  const { testMode, eyeToExamine,eyeStrength, diopterResult } = location.state || {};
  const history = useHistory();
  const [randomString, setRandomString] = useState(generateRandomString());
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  
  const [isListening, setIsListening] = useState(false);
  const visualAcuityMeasurements = [0.8, 1, 1.2, 1.5, 2, 2.8, 4, 8];
  const eyeStrengthValues = ['20/20', '20/25', '20/30', '20/40', '20/50', '20/70', '20/100', '20/200'];
  //const diopters = [0.00,-0.25,-0.50,-0.75,-1.00,-1.25,-1.50,-2.00,-2.50]; 
  const diopters = [0.00, 0.5, 1.00, 1.50, 2.00, 2.75, 4.00, 6.00];
  const diopterMagnification = [0, 1.125, 1.25, 1.375, 1.5, 1.6875, 2.0, 2.5]
  const initialIndex = eyeStrength ? eyeStrengthValues.indexOf(eyeStrength) : 0;
  const [visualAcuityIndex, setVisualAcuityIndex] = useState(initialIndex);
  const [buttonPressCount, setButtonPressCount] = useState(7 - initialIndex);

  const icons = [
    { icon: <CiApple />, keyword: "apple" },
    { icon: <PiBirdBold />, keyword: "bird" },
    { icon: <FaSailboat />, keyword: "boat" },
    { icon: <PiButterflyLight />, keyword: "butterfly" },
    { icon: <FaCarSide />, keyword: "car" },
    { icon: <GiSittingDog />, keyword: "dog" },
    { icon: <FaCat />, keyword: "cat" },
    { icon: <FaHorse />, keyword: "horse" },
    { icon: <WiTrain />, keyword: "train" },
  ];

  let webkitSpeechRecognition;

  const getFontSizePx = (mm: number) => {
    return getDynamicFontSize(mm);
  };
  // Get the magnification factor based on the diopter result
  const magnificationFactor = diopterMagnification[initialIndex];

  // Apply magnification to the base visual acuity measurement to get adjusted font size
  // const fontSizeMm = visualAcuityMeasurements[visualAcuityIndex] * magnificationFactor;
  var fontSizePx = getFontSizePx(visualAcuityMeasurements[visualAcuityIndex] *magnificationFactor);
  console.log(`Diopter Result: ${diopterResult}, Magnification Factor: ${magnificationFactor},  Font Size PX: ${fontSizePx}`);

  //fontSizePx = fontSizeMm * 3.77953; // Convert mm to px assuming 96 DPI and standard scaling

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const webkitRecognition = new window.webkitSpeechRecognition();
      // const speechRecognitionList = new window.webkitSpeechGrammarList();
      // const grammar =
      // "#JSGF V1.0; grammar keywords; public <keyword> = (apple | bird | butterfly | car | dog | cat | horse | train | boat);";
      // speechRecognitionList.addFromString(grammar, 1);
  
      // webkitRecognition.grammars = speechRecognitionList;
      webkitRecognition.maxAlternatives = 1;
      webkitRecognition.continuous = true;
      webkitRecognition.interimResults = true;
      webkitRecognition.lang = "en-US";
  
      webkitRecognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          let transcript = event.results[i][0].transcript.trim().toLowerCase();
  
          console.log("Transcript:", transcript);
  
          setRandomString((currentString) =>
            currentString.map((obj) =>
              obj.keyword === transcript ? { ...obj, recognized: true } : obj
            )
          );
        }
      };
  
      setRecognition(webkitRecognition);
    } else {
      alert(
        "Your browser does not support the Web Speech API. Please use Chrome or Safari."
      );
    }
  }, []);

  const updateRandomIcons = () => {
    const newCount = buttonPressCount + 1;
    setButtonPressCount(newCount);
  
    if (newCount > 7) {
      endTest();
    } else {
      const currentGreenIconCount = randomString.filter((obj) => obj.recognized).length;
  
      if (currentGreenIconCount >= 3) {
        decreaseFontSize();
      }
  
      setRandomString(generateRandomString());
    }
  };
//if the user made it to 20/20 with a diopter correction, recommended diopter to be reduced by one to be conservative with the lens correction. 
//If they didnt make it to 20/20, pass the same diopterValue of the correction as the proper diopter value

  const endTest = () => {
    setButtonPressCount(0);
    const eyeStrengthIndex = visualAcuityIndex;  // Get index of the current eye strength

    const selectedEyeStrength = eyeStrengthValues[visualAcuityIndex];
    let selectedDiopterResult = diopters[eyeStrengthIndex];  // Fetch the diopter based on the final visual acuity index
    if (selectedEyeStrength === '20/20' && eyeStrengthIndex > 0) {
      selectedDiopterResult = diopters[eyeStrengthIndex - 1];  // Reduce diopter by one level to be conservative
  }
    console.log("Navigating to Results2 with the following parameters:");
    console.log("Test Mode:", testMode);
    console.log("Eye to Examine:", eyeToExamine);
    console.log("Selected Eye Strength:", selectedEyeStrength);
    console.log("Diopter Result:", diopterResult);
    console.log("EyeStrength:", eyeStrength);
    console.log("Eye Strength Index:", eyeStrengthIndex);
    history.push("./Results2", { testMode, eyeToExamine, diopterResult:selectedDiopterResult, eyeStrength: selectedEyeStrength,initialIndex, eyeStrengthIndex });
};


  const toggleListening = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
      setIsListening(!isListening);
    }
  };

  const increaseFontSize = () => {
    if (visualAcuityIndex < visualAcuityMeasurements.length - 1) {
      setVisualAcuityIndex(visualAcuityIndex + 1);
      setRandomString(generateRandomString());
    }
  };

  const decreaseFontSize = () => {
    if (visualAcuityIndex > 0) {
      setVisualAcuityIndex(visualAcuityIndex - 1);
      setRandomString(generateRandomString());
    }
  };

  const handleIconClick = (keyword: string) => {
    const updatedRandomString = randomString.map((obj) =>
      obj.keyword === keyword ? { ...obj, recognized: true } : obj
    );
    setRandomString(updatedRandomString);
  };

  return (
    <IonPage>
      <Header headerText="Vision Test" />
      <IonContent className="ion-padding" scrollY={false}>
        <IonText style={{ textAlign: "center" }}>
          <h1 style={{fontWeight: "bold"}}>Shape Test: {buttonPressCount}/7</h1>
        </IonText>
        <IonText className="testIcon" style={{ fontSize: `${fontSizePx}px` }}>
          <div className="icons-div">
            {randomString.map((obj, index) => (
              <span
                key={index}
                style={{ color: obj.recognized ? "green" : "black", marginRight: "5px", marginLeft: "5px" }}
              >
                {obj.icon}
              </span>
            ))}
          </div>
          
        </IonText>

        {/* <IonButton expand="full" onClick={toggleListening}>
          {isListening ? "Stop Speech Recognition" : "Start Speech Recognition"}
        </IonButton> */}
        {/* <Button buttonText={isListening ? "Stop Speech Recognition" : "Start Speech Recognition"} onClickAction={toggleListening}>

        </Button> */}
        <div className="shape-buttons">
          <div className="speech-button-container">
            <button className="speech-button" onClick={toggleListening}>
              <h1>{isListening ? "Stop Speech Recognition" : "Start Speech Recognition"}</h1>
              <IonIcon className="eye" slot="end" size="large" icon={eyeOutline}></IonIcon>
            </button>
          </div>
          <div className="speech-next-button-container">
            <button className="speech-next-button" onClick={updateRandomIcons}>
              <h1>Next</h1>
              <IonIcon className="eye" slot="end" size="large" icon={eyeOutline}></IonIcon>
            </button>
          </div>
          <div className="speech-end-button-container">
            <button className="speech-end-button" onClick={endTest}>
              <h1>End Test</h1>
              <IonIcon className="eye" slot="end" size="large" icon={eyeOutline}></IonIcon>
            </button>
          </div>
          <div className="shape-container">
          <div className="shape-row">
            {icons.slice(0, 5).map((obj, index) => (
              <button key={index} onClick={() => handleIconClick(obj.keyword)}>
                {obj.icon}
              </button>
            ))}
          </div>
          <div className="shape-row">
            {icons.slice(5).map((obj, index) => (
              <button key={index} onClick={() => handleIconClick(obj.keyword)}>
                {obj.icon}
              </button>
            ))}
          </div>
        </div>
      </div>
      </IonContent>
    </IonPage>
  );
};

export default ShapeTest2;