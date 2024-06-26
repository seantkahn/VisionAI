import * as vision from "@mediapipe/tasks-vision";
import Webcam from "react-webcam";
import React, { useRef, useEffect, useState } from "react";
import "./Pretest.css";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Button } from "react-bootstrap";

const stopWebcam = () => {
  const streams = document.querySelectorAll("video").forEach((videoElement) => {
    if (videoElement.srcObject) {
      const tracks = (videoElement.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  });
};
interface LocationState {
  testMode?: string;
  eyeToExamine?: string;
}

const PreTest: React.FC = () => {
  const [faceLandmarker, setFaceLandmarker] = useState<any>(null);
  const [webcamRunning, setWebcamRunning] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runningMode: "IMAGE" | "VIDEO" = "VIDEO";
  const location = useLocation<LocationState>();
  const { testMode, eyeToExamine } = location.state || {};
  const history = useHistory();

  useEffect(() => {
    // This will be called when the component unmounts
    return () => {
      stopWebcam();
    };
  }, []);

  const continueToExam = () => {
    console.log("Test Mode:", testMode, "Eye to Examine:", eyeToExamine);
    stopWebcam();
    if (testMode === "Letters") {
      history.push("/LetterTest", { testMode, eyeToExamine, distance });
    } else if (testMode === "Images") {
      history.push("/ShapeTest", { testMode, eyeToExamine, distance });
    } else {
      console.error("Invalid test mode:", testMode);
    }
  };

  useEffect(() => {
    const loadFaceLandmarker = async () => {
      const { FaceLandmarker, FilesetResolver } = vision;
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      const newFaceLandmarker = await FaceLandmarker.createFromOptions(
        filesetResolver,
        {
          baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
            delegate: "GPU",
          },
          outputFaceBlendshapes: true,
          runningMode,
          numFaces: 1,
        }
      );
      setFaceLandmarker(newFaceLandmarker);
    };

    loadFaceLandmarker();
    return () => {
      // If webcam is running, stop it
      if (webcamRef.current && webcamRef.current.video) {
        const stream = webcamRef.current.video.srcObject;
        if (stream) {
          const tracks = (stream as MediaStream).getTracks();
          tracks.forEach((track) => track.stop()); // Stop each track
        }
      }

      // Cancel any ongoing animation frame requests
      setWebcamRunning(false); // This should stop the predictWebcam loop
    };
  }, []);

  const onWebcamStart = () => {
    if (webcamRunning) {
      console.log("Trying to call predictwebcam from onwebcamstart");

      predictWebcam();
    }
  };
  // Enable webcam
  const enableCam = () => {
    predictWebcam();

    if (!faceLandmarker) {
      console.log("Wait! FaceLandmarker not loaded yet.");
      return;
    }

    setWebcamRunning(!webcamRunning);
    // if (!webcamRunning) {
    //   const constraints = { video: true };
    //   navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    //     if (webcamRef.current) {
    //       webcamRef.current.srcObject = stream;
    //       webcamRef.current.addEventListener('loadeddata', predictWebcam);
    //     }
    //   });
    // }
  };

  const predictWebcam = async () => {
    console.log("predictWebcam called");

    if (!faceLandmarker || !webcamRef.current || !canvasRef.current) {
      return;
    }

    const videoElement = webcamRef.current.video;
    if (!videoElement) return;

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext("2d");

    if (!canvasCtx) {
      return;
    }

    const maxWidth = Math.min(window.innerWidth, 640);
    const ratio = videoElement.videoHeight / videoElement.videoWidth;

    canvas.style.width = `${maxWidth}px`;
    canvas.style.height = `${maxWidth * ratio}px`;

    canvas.width = maxWidth;
    canvas.height = maxWidth * ratio;

    try {
      console.log("Trying face landmark detection");

      let results = await faceLandmarker.detectForVideo(
        videoElement,
        performance.now()
      );
      console.log("Detection results:", results);
      console.log("Face landmarks:", results.faceLandmarks[0]);
      console.log("Detection results:", results);

      if (results.faceLandmarks) {
        let landmarks = results.faceLandmarks;
        for (landmarks in results.faceLandmarks) {
          console.log("Face landmarks:", results.faceLandmarks[0]);
          console.log(
            "Specific landmarks:",
            results.faceLandmarks[0][468],
            results.faceLandmarks[0][473]
          );
          console.log("Landmarks length:", landmarks.length);
          console.log("Landmark 468:", results.faceLandmarks[0][468]);
          console.log("Landmark 473:", results.faceLandmarks[0][473]);
          let pointLeft = {
            x: results.faceLandmarks[0][468].x,
            y: results.faceLandmarks[0][468].y,
          }; // Left eye keypoint
          let pointRight = {
            x: results.faceLandmarks[0][473].x,
            y: results.faceLandmarks[0][473].y,
          }; // Right eye keypoint

          const webcamFOV = 60; // Approximate field of view of the webcam
          const knownPupillaryDistanceMm = 63; // Average pupillary distance in millimeters
          let pixelDistanceBetweenEyes = calculatePixelDistance(
            pointLeft.x,
            pointLeft.y,
            pointRight.x,
            pointRight.y
          );

          const focalLengthPixels = 0.78;
          let distanceFromWebcamMm =
            (focalLengthPixels * knownPupillaryDistanceMm) /
            pixelDistanceBetweenEyes;
          let distanceFromWebcamInches = distanceFromWebcamMm / 25.4;

          setDistance(distanceFromWebcamInches);
          // console.log(`Distance from webcam: ${distanceFromWebcamInches.toFixed(2)} inches`);
          console.log(
            `Distance from webcam: ${distanceFromWebcamInches.toFixed(
              2
            )} inches`
          );
        }
      }
    } catch (error) {
      console.error("error in predictWebcam: ", error);
    }

    if (webcamRunning) {
      window.requestAnimationFrame(predictWebcam);
    }
  };

  const calculatePixelDistance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  return (
    <main className="PreTest" onClick={enableCam}>
      <Webcam ref={webcamRef} className="webcam" mirrored={true} autoPlay />
      <canvas ref={canvasRef} className="output_canvas" />
      <div className="distance-container">
        <p className="distance-text">Distance</p>
        <div className="distance-number">
          {" "}
          {distance ? `${distance.toFixed(0)}` : ""}
        </div>
      </div>
      <div className="continue-button-div">
        <Button className="continue-button" onClick={continueToExam}>
          {" "}
          Continue
        </Button>
      </div>
    </main>
  );
};

export default PreTest;
