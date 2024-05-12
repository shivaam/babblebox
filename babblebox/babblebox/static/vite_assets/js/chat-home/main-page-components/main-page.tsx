import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import ChatList from "./chat-list";
import ChatMessageList from "./chat-message-list";
import ImageTranscription from "./image-transcription";
import { deepPurple, amber, blueGrey, grey } from '@mui/material/colors';
import { ChatParticipants } from './chat-participants-list';
import { axiosInstance } from '../utils';
import { Chat } from '../tmp-scroll-html-css/chat-sections';

const MainPage: React.FC<{ chatId: string }> = ({ chatId }) => {
  const selectedChatId = chatId;

  const [selectedAudioMessageId, setSelectedAudioMessageId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [chat, setChat] = useState<Chat>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        console.log(chatId)
        const response = await axiosInstance.get<Chat[]>(`Chat/${chatId}`);
        setChat(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch chats.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const handleChatSelect = (chatId: string) => {
    setSelectedAudioMessageId(null);
    setSelectedImageId(null);
  };

  const handleAudioMessageSelect = (audioMessageId: string, imageId: string | null) => {
    setSelectedAudioMessageId(audioMessageId);
    setSelectedImageId(imageId);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2, backgroundColor: 'white', minHeight: '100vh' }}>
      {`Chat Topic: ${chat?.topic}, Created By: ${chat?.owner_username}`}

      <Grid container spacing={2} justifyContent="left" sx={{ height: '90vh', maxHeight: '90vh', overflowY: 'auto' }}>

        {/* Audio Messages Column */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={6} sx={{ p: 2, backgroundColor: grey[50], borderRadius: '16px', height: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ color: blueGrey[700], mb: 2 }}>
              Messages
            </Typography>
            <ChatMessageList chatId={chatId} onAudioMessageSelect={handleAudioMessageSelect} />
          </Paper>
        </Grid>

        {/* Transcriptions & Notes Column */}
        <Grid item xs={12} sm={6} md={5}>
          <Paper elevation={6} sx={{ p: 2, backgroundColor: grey[100], borderRadius: '16px', height: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ color: blueGrey[700], mb: 2 }}>
              Transcriptions & Notes
            </Typography>
            {selectedAudioMessageId && <ImageTranscription
              audioMessageId={selectedAudioMessageId}
              imageId={selectedImageId}
            />}
          </Paper>
        </Grid>

        {/* New Right Section */}
        <Grid item xs={12} md={4}>
          <Paper elevation={6} sx={{ p: 2, backgroundColor: grey[200], borderRadius: '16px', height: '60vh', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ color: blueGrey[700], mb: 2 }}>AI Topics</Typography>
              {/* Add content for AI Topics */}
            </Box>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="h6" sx={{ color: blueGrey[700], mb: 2 }}>Participants</Typography>
              <ChatParticipants chatId={chatId} />
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={6} sx={{ p: 2, backgroundColor: grey[200], borderRadius: '16px', height: '20vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ color: blueGrey[700], mb: 2 }}>AI Tips</Typography>
            {/* Add content for AI Tips */}
          </Paper>
        </Grid>
      </Grid>
    </Box>


  );
};

export default MainPage;
