import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import {axiosInstance} from "../utils";
import React from "react";
import { Button, IconButton, Typography } from '@mui/material';
import { Stop as StopIcon, Mic as MicIcon } from '@mui/icons-material';
interface IRecordNewChatMessageProps {
  chatId: string;
}

export const RecordNewChatMessage: React.FC<IRecordNewChatMessageProps> = ({chatId}) => {
  const {
    startRecording,
    stopRecording,
    recordingBlob,
    isRecording,
    recordingTime,
  }  = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
      autoGainControl: true,
    },
    (err) => console.table(err) // onNotAllowedOrFound
  );

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  React.useEffect(() => {
    if (!isRecording && recordingBlob) {
      uploadAudio(recordingBlob);
    }
  }, [isRecording, recordingBlob]);

  function uploadAudio(blob) {
    let formData = new FormData();
    const audioBlob = new Blob([blob], { type: 'audio/webm' });

    formData.append('chat_id', chatId);
    formData.append('audio_file.audio', audioBlob, 'filename.webm'); // 'filename.mp3' is the name of your file
    formData.append('image_id', '');

    for (let [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    console.log(audioBlob);
    const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    axiosInstance.post('ChatMessage/', formData, {
      headers: {'X-CSRFToken': csrf_token}
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }


  return (
    <div>
      <Typography variant="h6">Recording Time: {recordingTime} seconds</Typography>
      <IconButton color="primary" onClick={toggleRecording}>
        {isRecording ? <StopIcon /> : <MicIcon />}
      </IconButton>
      {recordingBlob && (
        <audio src={URL.createObjectURL(recordingBlob)} controls />
      )}
    </div>
  );
}
