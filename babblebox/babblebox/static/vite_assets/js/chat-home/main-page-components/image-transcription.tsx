// ImageTranscription.tsx
import React from 'react';
import { Box, Grid, Paper } from '@mui/material';
import ImageFetcher from './image-transcription-display/image-fetcher';
import AudioFetcher from './image-transcription-display/audio-fetcher';

interface Props {
  audioMessageId: string; // Received from the selected chat message
  imageId: string | null; // Received from the selected chat message
}

const ImageTranscription: React.FC<Props> = ({ audioMessageId, imageId }) => {
  return (
    <Box sx={{ height: '100%', overflow: 'auto', p: 2 }}>
      <Grid container direction="column" spacing={2} sx={{ height: '100%' }}>
        <Grid item xs={3} sx={{ height: '25%' }}>
          <Paper sx={{ height: '100%', overflow: 'auto', p: 2 }}>
            {audioMessageId && <AudioFetcher audioMessageId={audioMessageId} />}
          </Paper>
        </Grid>
        <Grid item xs={9} sx={{ height: '75%' }}>
          <Paper sx={{ height: '100%', overflow: 'auto', p: 2 }}>
            {imageId && <ImageFetcher imageId={imageId} />}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ImageTranscription;
