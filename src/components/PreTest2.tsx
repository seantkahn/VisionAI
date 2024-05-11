import { FaceMesh } from "@mediapipe/face_mesh";
import { Camera } from "@mediapipe/camera_utils";
import * as tf from "@tensorflow/tfjs";
import { Category, DrawingUtils, FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision';
import * as vision from "@mediapipe/tasks-vision";
import * as cam from "@mediapipe/camera_utils";
import Webcam from "react-webcam";
import React, { useRef, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./Pretest2.css";
import { IonPage, IonContent, IonButton, IonIcon } from "@ionic/react";
import { eyeOutline } from "ionicons/icons";
import SampleTest from "./PreTest";
import Header from "./Header/Header";
import Button from "./Button/Button";
import { useLocation } from "react-router-dom";


const PreTest2: React.FC = () => {
  const [faceLandmarker, setFaceLandmarker] = useState<any>(null);
  const [webcamRunning, setWebcamRunning] = useState<boolean>(false);
  const [message, setMessage] = useState("Tap for live distance"); // Message to display in the distance-box

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const runningMode: "IMAGE" | "VIDEO" = "VIDEO";
  const videoWidth = 480;
  const knownDistanceInches = 12; // The known distance from the camera in inches
  const knownDistanceMm = knownDistanceInches * 25.4; // Convert inches to mm
  const knownWidthMm = 63;//mm
  const focalLengthPixels = 0.78; // Your calculated focal length in pixels

  function calculateDistanceFromWebcam(
    focalLengthPixels: number,
    pixelDistanceBetweenEyes: number,
    knownWidthMm: number
  ) {
    // Calculate the distance from the webcam to the face using the focal length
    return (focalLengthPixels * knownWidthMm) / pixelDistanceBetweenEyes;
  }

  // This function calculates the distance in mm based on the pixel distance and the known distance
  function calculateDistanceInMm(
    pixelDistance: number,
    knownDistanceInMm: number,
    referencePixelDistance: number
  ) {
    return (pixelDistance * knownDistanceInMm) / referencePixelDistance;
  }

  function calculateEyeDistanceFromWebcam(
    pixelDistanceBetweenEyes: number,
    knownDistanceInMm: number,
    videoWidth: number,
    FOV: number
  ) {
    // Calculate the number of pixels per millimeter
    const pixelsPerMm = pixelDistanceBetweenEyes / knownDistanceInMm;
    // Assuming the video width represents the full FOV, calculate the FOV in mm
    const fovWidthMm = videoWidth / pixelsPerMm;
    // Use trigonometry to estimate the distance from the camera to the face
    // This is a simplification and assumes a flat plane and central positioning
    const distanceFromCameraMm =
      fovWidthMm / 2 / Math.tan((FOV / 2) * (Math.PI / 180));
    return distanceFromCameraMm;
  }
  useEffect(() => {
    const setupWebcam = async () => {
      const constraints = { video: true };
      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (webcamRef.current && webcamRef.current.video) {
          webcamRef.current.video.srcObject = stream;
          webcamRef.current.video.play();
        }
      } catch (error) {
        console.error('Error setting up webcam:', error);
      }
    };

    const loadFaceLandmarker = async () => {
      const { FaceLandmarker, FilesetResolver } = vision;
      const filesetResolver = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
      );
      const newFaceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task`,
          delegate: "GPU"
        },
        outputFaceBlendshapes: true,
        runningMode,
        numFaces: 1
      });
      setFaceLandmarker(newFaceLandmarker);
      await setupWebcam();
      setWebcamRunning(true);
    };

    loadFaceLandmarker();
    return () => {
      // If webcam is running, stop it
      if (webcamRef.current && webcamRef.current.video) {
        const stream = webcamRef.current.video.srcObject;
        if (stream) {
          const tracks = (stream as MediaStream).getTracks();
          tracks.forEach(track => track.stop()); // Stop each track
        }
      }
      // Cancel any ongoing animation frame requests
      setWebcamRunning(false); // This should stop the predictWebcam loop
    };
  }, []);
  const onCanvasClick = () => {
    if (webcamRunning && faceLandmarker) {
      setMessage("");  // Clear the message upon canvas click
      predictWebcam();
    } else {
      console.log("System is not ready yet.");
    }
  };
  const onWebcamStart = () => {
    if (webcamRunning) {
        // console.log('Trying to call predictwebcam from onwebcamstart');

      predictWebcam();
    }
  };
  // Enable webcam
  const enableCam = () => {

    if (!faceLandmarker) {
      console.log("Wait! FaceLandmarker not loaded yet.");
      return;
    }  
    if (!webcamRunning) {
      setWebcamRunning(true);
      predictWebcam();  // Initiate webcam prediction as soon as the webcam is set to run
    }
    else{
      predictWebcam();
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
    // console.log('predictWebcam called');

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
  
    const maxWidth = Math.min(window.innerWidth, 340);
    const ratio = videoElement.videoHeight / videoElement.videoWidth;
  
    canvas.style.width = `${maxWidth}px`;
    canvas.style.height = `${maxWidth * ratio}px`;
  
    canvas.width = maxWidth;
    canvas.height = maxWidth * ratio;
  
    try {
        // console.log('Trying face landmark detection');

      let results = await faceLandmarker.detectForVideo(videoElement, performance.now());
      // console.log('Detection results:', results);
      // console.log('Face landmarks:', results.faceLandmarks[0]);
      // console.log('Detection results:', results);

      if (results.faceLandmarks) {
        let landmarks = results.faceLandmarks;
        for (landmarks in results.faceLandmarks) {

        // console.log('Face landmarks:', results.faceLandmarks[0]);
        // console.log('Specific landmarks:', results.faceLandmarks[0][468], results.faceLandmarks[0][473]);
        // console.log('Landmarks length:', landmarks.length);
        // console.log('Landmark 468:', results.faceLandmarks[0][468]);
        // console.log('Landmark 473:', results.faceLandmarks[0][473]);
        let pointLeft = { x: results.faceLandmarks[0][468].x, y: results.faceLandmarks[0][468].y }; // Left eye keypoint
        let pointRight = { x: results.faceLandmarks[0][473].x, y: results.faceLandmarks[0][473].y }; // Right eye keypoint
  
        const webcamFOV = 60; // Approximate field of view of the webcam
        const knownPupillaryDistanceMm = 63; // Average pupillary distance in millimeters
        let pixelDistanceBetweenEyes = calculatePixelDistance(
          pointLeft.x, pointLeft.y,
          pointRight.x, pointRight.y
        );
  
        const focalLengthPixels = 0.78;
        let distanceFromWebcamMm = (focalLengthPixels * knownPupillaryDistanceMm) / pixelDistanceBetweenEyes;
        let distanceFromWebcamInches = distanceFromWebcamMm / 25.4;
        // console.log(`Distance from webcam: ${distanceFromWebcamInches.toFixed(2)} inches`);
          try{
            canvasCtx.font = 'bold 30px Arial';
            canvasCtx.fillStyle = 'white';
            canvasCtx.textAlign = 'center'; // Center horizontally
            canvasCtx.textBaseline = 'middle'; // Center vertically
            canvasCtx.fillText(`Distance: ${distanceFromWebcamInches.toFixed(2)} inches`, canvas.width / 2, canvas.height / 2);
                      }
          catch(e){
            // console.log("error drawing distance on canvas",e);
          }
        // console.log(`Distance from webcam: ${distanceFromWebcamInches.toFixed(2)} inches`);
      }
    }
    } catch (error) {
      // console.error("error in predictWebcam: ", error);
    }

    if (webcamRunning) {
      window.requestAnimationFrame(predictWebcam);
    }
  };
  
  const calculatePixelDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };


  return (
    <div className="PreTest2" onClick={onCanvasClick}>
      <Webcam ref={webcamRef} className="webcam2" mirrored={true} autoPlay style={{top: "0", left: "0"}}/>
      <div className="camera-container2">
      <div className="message-overlay">{message}</div>  {/* Message overlay */}

        <div className="distance-box2">
          <canvas ref={canvasRef} className="output_canvas2" />
        </div>

      </div>
      
    </div>
    
  );
};

export default PreTest2;
