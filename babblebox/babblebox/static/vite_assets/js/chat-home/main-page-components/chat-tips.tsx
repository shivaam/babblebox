import React, { useEffect, useState } from 'react';
import { Typography, Box, CircularProgress } from '@mui/material';
import { axiosInstance } from '../utils';

const ChatTips: React.FC<{ chatMessageId: string | null }> = ({ chatMessageId }) => {
  const [tips, setTips] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTips = async () => {
      if (!chatMessageId) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get(`/ChatMessage/${chatMessageId}/`);
        setTips(response.data.ai_tips);
        setError(null);
      } catch (error) {
        setError('Failed to fetch chat tips.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTips();
  }, [chatMessageId]);

  if (!chatMessageId) {
    return (
      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
        Select a message to see AI tips.
      </Typography>
    );
  }

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography variant="body1" sx={{ color: 'error.main' }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="body1" sx={{ color: 'text.primary' }}>
        {tips ? tips : 'No AI tips available for this message.'}
      </Typography>
    </Box>
  );
};

export default ChatTips;
