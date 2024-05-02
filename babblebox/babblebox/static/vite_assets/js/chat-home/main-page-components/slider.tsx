import React, { useState, useEffect } from 'react';
import { Slider, Tooltip, Box, Typography } from '@mui/material';
import axios from 'axios';
import { axiosInstance } from '../utils';


const AudioSlider = ({ chatId }) => {
  const [audios, setAudios] = useState([]);
  const [value, setValue] = useState(0);
  const [fileLabel, setFileLabel] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChatMessagesAndAudioFiles = async () => {
      setLoading(true);
      try {
        // Fetch chat messages
        const chatResponse = await axiosInstance.get(`ChatMessage/?chat_id=${chatId}`);
        const chatMessages = chatResponse.data;

        // Fetch audio files for each chat message that has an audio message ID
        const audioPromises = chatMessages.map(message =>
          message.audio_message_id ? axiosInstance.get(`AudioFile/${message.audio_message_id}`) : Promise.resolve(null)
        );
        const audioFilesResponses = await Promise.all(audioPromises);
        const audioFiles = audioFilesResponses.map(response => response ? response.data : null).filter(audio => audio);

        // Process audio files data
        let startPoint = 0;
        const audioData = audioFiles.map(audio => {
          const length = 10;
          const result = {
            ...audio,
            start: startPoint,
            end: startPoint + length
          };
          startPoint += length;
          return result;
        });

        setAudios(audioData);
        setError(null);
      } catch (error) {
        setError('Failed to fetch chat messages or audio files.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatMessagesAndAudioFiles();
  }, [chatId]);

  // Calculate marks and find the current audio file
  const marks = audios.map(audio => ({
    value: audio.start,
    label: audio.owner_username,
  }));

  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
    const currentAudio = audios.find(audio => newValue >= audio.start && newValue < audio.end);
    setFileLabel(currentAudio ? currentAudio.transcription_en : "No file");
  };

  return (
    <Box sx={{ width: '100%', padding: 3 }}>
      {loading && <Typography>Loading...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <>
          <Slider
            value={value}
            onChange={handleSliderChange}
            step={1}
            marks={marks}
            min={0}
            max={audios.length ? audios[audios.length - 1].end : 0}
            valueLabelDisplay="auto"
          />
          <Typography>Current File: {fileLabel}</Typography>
        </>
      )}
    </Box>
  );
};

export default AudioSlider;
