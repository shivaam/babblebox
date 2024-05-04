import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Grid, Typography, Paper } from '@mui/material';
import Participants from './Participants';
import Topics from './Topics';
import Tips from './Tips';
import MessageList from './MessageList';

const ChatDetailsPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3}>
            <MessageList chatId={chatId} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ mb: 2 }}>
            <Participants chatId={chatId} />
          </Paper>
          <Paper elevation={3} sx={{ mb: 2 }}>
            <Topics chatId={chatId} />
          </Paper>
          <Paper elevation={3}>
            <Tips chatId={chatId} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ChatDetailsPage;
