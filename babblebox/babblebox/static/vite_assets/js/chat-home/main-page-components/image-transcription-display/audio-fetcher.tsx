// AudioFetcher.tsx
import React from 'react';
import RetryHandler from './retry-handler';
import { axiosInstance } from '../../utils';
import { Box, CircularProgress, Typography } from '@mui/material';

interface AudioFile {
  id: string;
  audio: string; // URL to the audio file
  transcription_en: string;
  transcription_original: string;
  file_location: string;
  upload_timestamp: Date;
}

interface AudioFetcherProps {
  audioMessageId: string;
}

const fetchAudioFile = async (audioMessageId: string) => {
  const response = await axiosInstance.get<AudioFile>(`AudioFile/${audioMessageId}`);
  return response.data;
};

const AudioFetcher: React.FC<AudioFetcherProps> = ({ audioMessageId }) => {
  return (
    <RetryHandler<AudioFile>
      fetchData={() => fetchAudioFile(audioMessageId)}
      maxRetries={3}
      retryTimeout={3000}
      render={(data, loading, error) => (
        <Box>
        {loading && <div>Loading audio <CircularProgress /></div>}
        {error && <Typography variant="body1" color="error">{error}</Typography>}
        {data && (
          <Box>
            <audio controls src={data.audio}>
              Your browser does not support the audio element.
            </audio>
            {data.transcription_en == null || data.transcription_en.length < 1 ? (
              <Typography variant="body1" color="error">Generating transcription...</Typography>
            ) : (
              <Typography variant="body1">Transcription (EN): {data.transcription_en}</Typography>
            )}
          </Box>
        )}
        {!loading && !data && !error && (
          <Typography variant="body1" color="error">Failed to generate audio</Typography>
        )}
      </Box>
      )}
    />
  );
};

export default AudioFetcher;
