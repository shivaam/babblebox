import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Paper, Box, Typography } from '@mui/material';
import axios from 'axios';
import {axiosInstance} from "../utils";
import {RecordNewChatMessage} from "./record-new-chat-message";

interface ChatMessage {
  id: string;
  chat_id: string;
  audio_message_id: string;
  timestamp: Date;
  image_id: string | null;
}

interface Props {
  chatId: string; // Assuming you pass the selected chatId as a prop
  onAudioMessageSelect: (audioMessageId: string, imageId: string | null) => void;
}

const ChatMessages: React.FC<Props> = ({ chatId, onAudioMessageSelect }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChatMessages = async () => {
      setLoading(true);
      try {
        // Replace with your actual endpoint, append the chatId to fetch messages for a specific chat
        const response = await axiosInstance.get<ChatMessage[]>(`ChatMessage/?chat_id=${chatId}`);
        setChatMessages(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch chat messages.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (chatId) {
      fetchChatMessages();
    }
  }, [chatId]); // Refetch when chatId changes

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <RecordNewChatMessage chatId={chatId} />
      <Paper sx={{ maxHeight: '100%', overflow: 'auto' }}>
        <List>
          {loading && <ListItem><ListItemText primary="Loading messages..." /></ListItem>}
          {error && <ListItem><ListItemText primary={error} /></ListItem>}
          {chatMessages.map((message) => (
            <ListItem key={message.id} onClick={() => onAudioMessageSelect(message.audio_message_id, message.image_id)}>
              <ListItemText
                primary={<Typography variant="body1">Message ID: {message.id}</Typography>}
                secondary={`Timestamp: ${new Date(message.timestamp).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ChatMessages;
