import React,{useState,useRef,useEffect} from 'react';
import { useReactMediaRecorder } from "react-media-recorder";

const MediaRecorder = () => {
    const [capturedFrames, setCapturedFrames] = useState([]);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
  const { status, startRecording, stopRecording, mediaBlobUrl } =
    useReactMediaRecorder({ video: true });

    // useEffect(() => {

    //     if (status === 'recording') {
    //         const canvas = canvasRef.current;
    //         const frameChunks = [];
      
    //         const intervalId = setInterval(captureFrame, 1000);
      
    //         return () => {
    //           clearInterval(intervalId);
    //         };
    //       }
    //main matter
    //     if (status === 'recording') {
    //       videoRef.current.addEventListener('loadedmetadata', () => {
    //         const intervalId = setInterval(captureFrame, 1000);
    
    //         return () => {
    //           clearInterval(intervalId);
    //         };
    //     });
    // }


    // if (status === 'recording') {
    //     const intervalId = setInterval(captureFrame, 1000);
    
    //     return () => {
    //       clearInterval(intervalId);
    //     };
    //   }
//   }, [status]);

//   const captureFrame = () => {
//     if (videoRef.current && canvasRef.current) {
//       const video = videoRef.current;
//       const canvas = canvasRef.current;
//       const ctx = canvas.getContext('2d');

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;

//       ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

//       canvas.toBlob((blob) => {
//         if (blob) {
//           const blobUrl = URL.createObjectURL(blob);
//           setCapturedFrames(prevFrames => [...prevFrames, blobUrl]);
//         }
//       }, 'image/jpeg', 0.95);

//     }
//   };

useEffect(() => {
    const captureFrame = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // canvas.toBlob((blob) => {
        //   if (blob) {
        //     const blobUrl = URL.createObjectURL(blob);
        //     setCapturedFrames((prevFrames) => [...prevFrames, blobUrl]);
        //   }
        // }, 'image/jpeg', 0.95);
        const frameImageData = canvas.toDataURL('image/jpeg');
        setCapturedFrames(prevFrames => [...prevFrames, frameImageData]);
      }
    };
    const handleLoadedMetadata = () => {
        const intervalId = setInterval(captureFrame, 1000);
        

        return () => {
            videoRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
          clearInterval(intervalId);
          videoRef.current.remove();
        };
      };
    if (status === 'recording') {
        videoRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);
      }
    //   else{
    //     clearInterval(intervalId);
    //   }


    //   return ()=>{

    //   }
    }, [status]);

  console.log(capturedFrames);
    

  return (
    <div>
      <p>{status}</p>
      <button onClick={startRecording}>Start Recording</button>
      <button onClick={stopRecording}>Stop Recording</button>
      <video ref={videoRef} src={mediaBlobUrl} controls autoPlay loop />
      <canvas ref={canvasRef} style={{ display: 'none' }} />

{capturedFrames.map((frame, index) => (
  <img key={index} src={frame} alt={`Captured Frame ${index}`} />
))}
    </div>
  );
};

export default MediaRecorder;