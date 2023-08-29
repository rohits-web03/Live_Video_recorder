import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// import MediaRecorder from './components/MediaRecorder.jsx'
import CameraRecorder from './components/CameraRecorder.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <CameraRecorder />
  </React.StrictMode>
)
