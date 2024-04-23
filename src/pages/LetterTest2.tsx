import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { IonContent, IonPage, IonButton, IonText, IonIcon } from "@ionic/react";
import Header from "../components/Header/Header";
import { useLocation } from "react-router-dom";
import { eyeOutline } from "ionicons/icons";
import "./LetterTest.css";
import Button from "../components/Button/Button";

interface LocationState {
  testMode?: string;
  eyeToExamine?: string;
  eyeStrength?: string;
  diopterResult?: number;
  firstPage?: number;
}

function getDynamicFontSize(physicalSizeMm: number) {
  function getDevicePixelRatio() {
    if (window.screen.systemXDPI !== undefined && window.screen.logicalXDPI !== undefined && window.screen.systemXDPI > window.screen.logicalXDPI) {
      return window.screen.systemXDPI / window.screen.logicalXDPI;
    } else if (window.devicePixelRatio !== undefined) {
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
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomString = [];
  let usedIndices = new Set();

  while (randomString.length < 5) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    if (!usedIndices.has(randomIndex)) {
      usedIndices.add(randomIndex);
      randomString.push({ letter: alphabet[randomIndex], recognized: false });
    }
  }

  return randomString;
};

const LetterTest2: React.FC = () => {
  const location = useLocation<LocationState>();
  const { testMode, eyeToExamine, diopterResult, firstPage } = location.state || {};
  const history = useHistory();
  const [randomString, setRandomString] = useState(generateRandomString());
  const [buttonPressCount, setButtonPressCount] = useState<number>(firstPage || 0);
  // const [fontSize, setFontSize] = useState(70);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [visualAcuityIndex, setVisualAcuityIndex] = useState(7); // Initial visual acuity index for 20/20 vision
  // const visualAcuityMeasurements = [0.23, 0.29, 0.35, 0.47, 0.58, 0.82, 1.23, 2.51];
  const visualAcuityMeasurements = [0.8, 1, 1.2, 1.5, 2, 2.8, 4, 8];
  const eyeStrengthValues = ['20/20', '20/25', '20/30', '20/40', '20/50', '20/70', '20/100', '20/200'];
  //const diopters = [0.00,-0.25,-0.50,-0.75,-1.00,-1.25,-1.50,-2.00,-2.50]; 
  const diopters = [0.00, 0.5, 1.00, 1.50, 2.00, 2.75, 4.00, 6.00];
  const diopterMagnification = [0, 1.125, 1.25, 1.375, 1.5, 1.6875, 2.0, 2.5]

  const getFontSizePx = (mm: number) => {
    return getDynamicFontSize(mm);
  };
  // Get the magnification factor based on the diopter result
  const magnificationIndex = diopters.findIndex(d => d === diopterResult);
  const magnificationFactor = diopterMagnification[magnificationIndex] || 1; // Default to 1 if no diopter result

  // Apply magnification to the base visual acuity measurement to get adjusted font size
  // const fontSizeMm = visualAcuityMeasurements[visualAcuityIndex] * magnificationFactor;

  var fontSizePx = getFontSizePx(visualAcuityMeasurements[visualAcuityIndex]*magnificationFactor);
  //fontSizePx = fontSizeMm * 3.77953; // Convert mm to px assuming 96 DPI and standard scaling

  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const webkitRecognition = new window.webkitSpeechRecognition();
      // const speechRecognitionList = new window.webkitSpeechGrammarList();
      // const grammar =
      //   "#JSGF V1.0; grammar lettersAndNumbers; public <letterOrNumber> = (A | B | C | D | ... | Z | 0 | 1 | 2 | ... | 9);";
      // speechRecognitionList.addFromString(grammar, 1);
  
      // webkitRecognition.grammars = speechRecognitionList;
      webkitRecognition.maxAlternatives = 1;
      webkitRecognition.continuous = true;
      webkitRecognition.interimResults = true;
      webkitRecognition.lang = "en-US";
  
      // Create a mapping of ignored words to corresponding letters
      const wordToLetterMap = {
        "OH": "O",
        "you": "U",
        "ok": "K",
        "jay": "J",
        "are": "R",
        "AYE": "I",
        "be": "B",
        "see": "C",
        "why": "Y",
      };
  
      webkitRecognition.onresult = (event) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          let transcript = event.results[i][0].transcript.trim().toUpperCase();
  
          // Replace each ignored word with a unique letter
          Object.entries(wordToLetterMap).forEach(([word, letter]) => {
            transcript = transcript.replace(new RegExp(word.toUpperCase(), 'g'), letter);
          });
  
          console.log("Transcript:", transcript);
  
          setRandomString((currentString) =>
            currentString.map((obj) =>
              obj.letter === transcript ? { ...obj, recognized: true } : obj
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

  const updateRandomIcons = () => {
    const newCount = buttonPressCount + 1;
    setButtonPressCount(newCount);
  
    if (newCount > 7) {
      endTest();
    } else {
      const currentGreenLetterCount = randomString.filter((obj) => obj.recognized).length;
  
      if (currentGreenLetterCount >= 3) {
        decreaseFontSize();
      }
  
      setRandomString(generateRandomString());
    }
  };

  const endTest = () => {
    setButtonPressCount(0);
      const selectedEyeStrength = eyeStrengthValues[visualAcuityIndex];
      const diopterResult = diopters[visualAcuityIndex];
      history.push("./Results2", { testMode, eyeToExamine, diopter: diopterResult, eyeStrength: selectedEyeStrength });
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

  const handleLetterButtonClick = (letter: string) => {
    const updatedRandomString = randomString.map((obj) =>
      obj.letter === letter ? { ...obj, recognized: true } : obj
    );
    setRandomString(updatedRandomString);
  };

  return (
    <IonPage>
      <Header headerText="Vision Test" />
      <IonContent className="ion-padding" scrollY={false}>
        <IonText style={{ textAlign: "center" }}>
          <h1 style={{fontWeight: "bold"}}>Letter Test: {buttonPressCount}/7</h1>
        </IonText>
        <IonText className="testText" style={{ fontSize: `${fontSizePx}px` }}>
          {randomString.map((obj, index) => (
            <span
              key={index}
              style={{ color: obj.recognized ? "green" : "black" }}
            >
              {obj.letter}
            </span>
          ))}
        </IonText>

        <div className="letter-buttons">
          <div className="letter-button-container">
            <button className="letter-button" onClick={toggleListening}>
              <h1>{isListening ? "Stop Speech Recognition" : "Start Speech Recognition"}</h1>
              <IonIcon className="eye" slot="end" size="large" icon={eyeOutline}></IonIcon>
            </button>
          </div>
          <div className="letter-next-button-container">
            <button className="letter-next-button" onClick={updateRandomIcons}>
              <h1>Next</h1>
              <IonIcon className="eye" slot="end" size="large" icon={eyeOutline}></IonIcon>
            </button>
          </div>
          <div className="letter-end-button-container">
            <button className="letter-end-button" onClick={endTest}>
              <h1>End Test</h1>
              <IonIcon className="eye" slot="end" size="large" icon={eyeOutline}></IonIcon>
            </button>
          </div>
        </div>

        <div className="keyboard-container">
          <div className="keyboard-row">
            {Array.from("QWERTYUIOP").map((letter, index) => (
              <button key={index} onClick={() => handleLetterButtonClick(letter)}>
                <p>{letter}</p>
              </button>
            ))}
          </div>
          <div className="keyboard-row">
            {Array.from("ASDFGHJKL").map((letter, index) => (
              <button key={index} onClick={() => handleLetterButtonClick(letter)}>
                <p>{letter}</p>
              </button>
            ))}
          </div>
          <div className="keyboard-row">
            {Array.from("ZXCVBNM").map((letter, index) => (
              <button key={index} onClick={() => handleLetterButtonClick(letter)}>
                <p>{letter}</p>
              </button>
            ))}
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default LetterTest2;