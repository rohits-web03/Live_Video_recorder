import React, { useRef, useEffect, useState } from 'react';

const CameraRecorder = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [capturedFrames, setCapturedFrames] = useState([]);
  const [recording, setRecording] = useState(false);
  //const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    let timeoutId; // Store the timeout ID

    const startRecording = async () => {
        try{
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;

      videoRef.current.addEventListener('loadedmetadata', () => {
        videoRef.current.play();
        //setVideoDuration(videoRef.current.duration);
        const captureFrame = () => {
          if (!recording) return;

          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');

          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          const frameImageData = canvas.toDataURL('image/jpeg');
          setCapturedFrames(prevFrames => [...prevFrames, frameImageData]);
          //yoloApiData();

          if (Math.floor(video.currentTime) < Math.floor(video.duration)) {
            timeoutId = setTimeout(captureFrame, 1000); // Capture frame per second
          } else {
            setRecording(false);
          }
        };

        if (recording) {
          captureFrame();
        }
      });
    }catch(err){
        console.log(`The error:${err}`);
    }
    };

    if (recording) {
      startRecording();
      yoloApiData();
    } else {
      clearTimeout(timeoutId); // Clear timeout when recording is stopped
    }

    return () => {
      clearTimeout(timeoutId); // Clear any remaining timeout when component unmounts
    };
  }, [recording]);
  let apiRes;

  async function yoloApiData(array){
    try{
      for(const element of array){
      const res=await fetch("/detect",{
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type":"application/json"
        },
        body:JSON.stringify(element.split(",")[1])
      });

      if (!res.ok) {
        throw new Error("Request failed");
    }
      apiRes=await res.json();
      if(res.status===422 || !apiRes || res.status(500)){
        console.log("Validation Error");
      } else if(res.status===200){
        console.log("Data successfully fetched");
        console.log(apiRes);
      }
    }
    } catch(err){
      console.error('Error fetching data:', err);
    }
  }
  const handleStartRecording = () => {
    setCapturedFrames([]);
    setRecording(true);
  };

  const handleStopRecording = () => {
    setRecording(false);
    // setVideoDuration(video.duration);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }

  };

  const handleReset = () => {
    setCapturedFrames([]);
    //setVideoDuration(0);
    setRecording(false);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    }
  };
  console.log(apiRes);
  console.log(capturedFrames);

  return (
    <div>
      <video ref={videoRef} style={{ display: 'block', marginBottom: '10px' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>

      <div>
        {!recording ? (
          <button onClick={handleStartRecording}>Start Recording</button>
        ) : (
          <div>
            <p>Recording...</p>
            <button onClick={handleStopRecording}>Stop Recording</button>
          </div>
        )}
        <button onClick={handleReset}>Reset</button>
      </div>

      <div>
      {/* <p>Video Duration: {videoDuration.toFixed(2)} seconds</p> */}
        {capturedFrames.map((frame, index) => (
          <img key={index} src={frame} alt={`Frame ${index}`} />
        ))}
        {/* {apiRes.map((element, index) => (
          <p key={index}>{element}</p>
        ))} */}
      </div>
    </div>
  );
};

export default CameraRecorder;
