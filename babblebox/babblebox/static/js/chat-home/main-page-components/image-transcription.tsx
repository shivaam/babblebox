import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

interface AudioFile {
  id: string;
  audio: string; // URL to the audio file
  transcription_en: string;
  transcription_original: string;
  file_location: string;
  upload_timestamp: Date;
}

interface ImageFile {
  id: string;
  image: string; // URL to the image file
  file_location: string;
  upload_timestamp: Date;
}

interface Props {
  audioMessageId: string; // Received from the selected chat message
  imageId: string | null; // Received from the selected chat message
}

const ImageTranscription: React.FC<Props> = ({ audioMessageId, imageId }) => {
  const [audioFile, setAudioFile] = useState<AudioFile | null>(null);
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true);
      try {
        // Fetch Audio File
        if (audioMessageId) {
          const audioResponse = await axios.get<AudioFile>(`http://localhost:8000/api/AudioFile/${audioMessageId}`);
          setAudioFile(audioResponse.data);
        }
        // Fetch Image File if imageId is not null
        if (imageId) {
          const imageResponse = await axios.get<ImageFile>(`http://localhost:8000/api/ImageFile/${imageId}`);
          setImageFile(imageResponse.data);
        }
        setError(null);
      } catch (error) {
        setError('Failed to fetch files.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [audioMessageId, imageId]);

  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
      <Paper sx={{ maxHeight: '100%', overflow: 'auto' }}>
        {loading && <CircularProgress />}
        {error && <Typography variant="body1" color="error">{error}</Typography>}
        {!loading && !error && (
          <>
            {audioFile && (
              <Box>
                <audio controls src={audioFile.audio}>
                  Your browser does not support the audio element.
                </audio>
                <Typography variant="body1">Transcription (EN): {audioFile.transcription_en}</Typography>
                <Typography variant="body1">Transcription (Original): {audioFile.transcription_original}</Typography>
              </Box>
            )}
            {imageFile && (
              <Box>
                <img src={imageFile.image} alt="Chat related" style={{ maxWidth: '100%', maxHeight: '100%' }} />
              </Box>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default ImageTranscription;
