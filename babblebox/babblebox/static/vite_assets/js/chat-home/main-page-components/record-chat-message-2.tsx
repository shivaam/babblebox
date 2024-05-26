import React, { useState, useRef } from 'react';
import IconButton from '@mui/material/IconButton';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import Typography from '@mui/material/Typography';
import ysFixWebmDuration from 'fix-webm-duration';
import { axiosInstance } from '../utils';
import { Card, CardContent, LinearProgress, Tooltip } from '@mui/material';
import { Snackbar } from '@mui/material';
import { Alert } from '@mui/material';

export const RecordNewChatMessage2 = ({ chatId, refreshChatMessage }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState();
  const mediaRecorderRef = useRef<MediaRecorder>();
  const mediaParts = useRef([]);
  const startTime = useRef<any>(null);

  const startRecording = async () => {
    mediaParts.current = [];
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const options = { mimeType: 'audio/webm' }; // Adjust as necessary
    mediaRecorderRef.current = new MediaRecorder(stream, options);
    mediaRecorderRef.current.onstop = handleStop;
    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    mediaRecorderRef.current.start();
    startTime.current = Date.now();
    setIsRecording(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleStop = () => {
    const duration = Date.now() - startTime.current;
    const buggyBlob = new Blob(mediaParts.current, { type: 'audio/webm' });

    // Fixing the duration of the recorded blob
    ysFixWebmDuration(buggyBlob, duration, { logger: false })
      .then(fixedBlob => {
        setRecordedAudio(fixedBlob);
        console.log(fixedBlob)
        // Cleanup the stream to avoid memory leaks
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        displayResult(fixedBlob);
        uploadAudio(fixedBlob);
      });
  };

  const uploadAudio = (blob) => {
    let formData = new FormData();
    const audioBlob = new Blob([blob], { type: 'audio/webm' });

    formData.append('chat_id', chatId);
    formData.append('audio_file.audio', audioBlob, 'filename.webm');
    formData.append('image_id', '');
    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    console.log(blob)
    console.log(formData)
    axiosInstance.post('ChatMessage/', formData)
      .then(response => {
        console.log(response.data);
        setSnackbarMessage('Message sent successfully');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        refreshChatMessage();
      })
      .catch(error => {
        console.error(error);
        setSnackbarMessage('Failed to send message');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  const handleDataAvailable = (event) => {
    if (event.data && event.data.size > 0) {
      mediaParts.current.push(event.data);
    }
  };

  const displayResult = (blob) => {
    const url = URL.createObjectURL(blob);
    setRecordedAudio(url);
  };

  return (
    <>
    <Card sx={{ maxWidth: 345, m: 2, width: '80%'}}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Tooltip title={isRecording ? 'Stop Recording' : 'Record New Message'}>
          <IconButton
            color="primary"
            onClick={isRecording ? stopRecording : startRecording}
            sx={{ fontSize: 24 }}
          >
            {isRecording ? <StopIcon sx={{ fontSize: 40 }} /> : <MicIcon sx={{ fontSize: 30 }} />}
          </IconButton>
        </Tooltip>
        {isRecording && (
          <LinearProgress color="secondary" sx={{ width: '100%', mt: 1 }} />
        )}
      </CardContent>
    </Card>
    <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
      <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
        {snackbarMessage}
      </Alert>
    </Snackbar>
    </>
  );
};
