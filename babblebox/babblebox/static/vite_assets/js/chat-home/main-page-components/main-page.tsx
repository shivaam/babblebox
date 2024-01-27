import React, { useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';
import ChatList from "./chat-list";
import ChatMessageList from "./chat-message-list";
import ImageTranscription from "./image-transcription";

const MainPage: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedAudioMessageId, setSelectedAudioMessageId] = useState<string | null>(null);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    // Reset audio message and image when a new chat is selected
    setSelectedAudioMessageId(null);
    setSelectedImageId(null);
  };

  const handleAudioMessageSelect = (audioMessageId: string, imageId: string | null) => {
    setSelectedAudioMessageId(audioMessageId);
    setSelectedImageId(imageId);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Grid container spacing={3}>
        {/* Chat Messages Column */}
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', color: 'text.secondary', height: '90vh' }}>
            <ChatList onChatSelect={handleChatSelect} />
          </Paper>
        </Grid>

        {/* Audio Messages Column */}
        <Grid item xs={6} sm={3}>
          <Paper sx={{ p: 2, textAlign: 'center', color: 'text.secondary', height: '90vh' }}>
            {selectedChatId && <ChatMessageList chatId={selectedChatId} onAudioMessageSelect={handleAudioMessageSelect} />}
          </Paper>
        </Grid>

        {/* Image and Transcription Column */}
        <Grid item xs={12} sm={6}>
          <Paper sx={{ p: 2, textAlign: 'center', color: 'text.secondary', height: '90vh' }}>
            {selectedAudioMessageId && <ImageTranscription
                audioMessageId={selectedAudioMessageId}
                imageId={selectedImageId}
            />}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default MainPage;
