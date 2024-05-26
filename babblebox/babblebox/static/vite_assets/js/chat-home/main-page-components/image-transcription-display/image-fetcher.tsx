// ImageFetcher.tsx
import React from 'react';
import RetryHandler from './retry-handler';
import { axiosInstance } from '../../utils';
import { Box, CircularProgress, Typography } from '@mui/material';

interface ImageFile {
  id: string;
  image: string; // URL to the image file
  file_location: string;
  upload_timestamp: Date;
}

interface ImageFetcherProps {
  imageId: string;
}

const fetchImageFile = async (imageId: string) => {
  const response = await axiosInstance.get<ImageFile>(`ImageFile/${imageId}`);
  return response.data;
};

const ImageFetcher: React.FC<ImageFetcherProps> = ({ imageId }) => {
  return (
    <RetryHandler<ImageFile>
      fetchData={() => fetchImageFile(imageId)}
      maxRetries={2}
      retryTimeout={5000}
      render={(data, loading, error) => (
        <Box>
        {loading && <div>Loading image <CircularProgress /></div>}
        {error && <Typography variant="body1" color="error">{error}</Typography>}
        {data && (
          <Box>
            <img src={data.image} alt="Chat related" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          </Box>
        )}
        {!loading && !data && !error && (
          <Typography variant="body1" color="error">Failed to generate image</Typography>
        )}
      </Box>
      )}
    />
  );
};

export default ImageFetcher;
