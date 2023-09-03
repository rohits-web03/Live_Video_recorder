import React, { useState, useRef, useEffect } from 'react';

const CameraRecorder = () => {
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);
  const [apiResponse, setApiResponse] = useState('');
  const videoRef = useRef();
  const isRecording = useRef(false);
  const synth = useRef(window.speechSynthesis);

  const startRecording = async () => {
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(newStream);
      videoRef.current.srcObject = newStream;
      await videoRef.current.play();
      setRecording(true);
      isRecording.current = true;
      captureAndSendFrame();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const speakApiResponse = (text, rate) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate; // Set the desired speech rate
      utterance.onend = resolve;
      synth.current.speak(utterance);
    });
  };

  const resetPlayer = () => {
    setApiResponse('');
    videoRef.current.srcObject = null;
  };

  const stopRecording = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setRecording(false);
      setApiResponse('');
      videoRef.current.srcObject = null;
      isRecording.current = false;
    }
  };

  const captureAndSendFrame = async () => {
    try {
      if (!videoRef.current || !isRecording.current) return;

      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const frameDataURL = canvas.toDataURL('image/jpeg');

      const base64Frame = frameDataURL.split(',')[1];

      const response = await fetch('http://127.0.0.1:8000/detect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imagedata: base64Frame }),
      });

      const data = await response.json();
      setApiResponse(JSON.stringify(data));
      const text = JSON.stringify(data);

      console.log(text);
      await speakApiResponse(text, 1.5);
      if (isRecording.current) {
        captureAndSendFrame();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  return (
    <div>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <button onClick={resetPlayer}>Reset</button>
      <div id="videoContainer">
        <video ref={videoRef} style={{ display: 'block', marginBottom: '10px' }} />
      </div>
      <div>{apiResponse && <p>API Response: {apiResponse}</p>}</div>
    </div>
  );
};

export default CameraRecorder;