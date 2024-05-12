import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Paper, Box, Typography, IconButton, Slide } from '@mui/material';
import axios from 'axios';
import {axiosInstance} from "../utils";
import {RecordNewChatMessage} from "./record-new-chat-message";
import { formatDistanceToNow } from 'date-fns';
import { RecordNewChatMessage2 } from './record-chat-message-2';
import RefreshIcon from '@mui/icons-material/Refresh';

interface ChatMessage {
  id: string;
  chat_id: string;
  audio_message_id: string;
  timestamp: Date;
  image_id: string | null;
  display_time: string;
  owner_username: string;
}

interface Props {
  chatId: string; // Assuming you pass the selected chatId as a prop
  onAudioMessageSelect: (audioMessageId: string, imageId: string | null) => void;
}

const ChatMessages: React.FC<Props> = ({ chatId, onAudioMessageSelect }) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [displayMessages, setDisplayMessages] = useState([]);

  const fetchChatMessages = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`ChatMessage/?chat_id=${chatId}`);
      const messageData = response.data.map(message => ({
        ...message,
        display_time: formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })
      })).reverse();
      setChatMessages(messageData);
      setError(null);
    } catch (error) {
      setError('Failed to fetch chat messages.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchChatMessages();
  }, [chatId]);

   //replace message id with number from 1 to N
  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <RecordNewChatMessage2 chatId={chatId} />
      <IconButton
        onClick={fetchChatMessages}
        sx={{ position: 'relative', top: '-10px', left: '90%'}}
        color="primary"
      >
        <RefreshIcon />
      </IconButton>
      <Paper sx={{ maxHeight: '100%', overflow: 'auto' }}>
        <List>
          {loading && <ListItem><ListItemText primary="Loading messages..." /></ListItem>}
          {error && <ListItem><ListItemText primary={error} /></ListItem>}
          {chatMessages.map((message, index) => (
            <Slide key={message.id} direction="down" in={true} mountOnEnter unmountOnExit>
              <ListItem onClick={() => onAudioMessageSelect(message.audio_message_id, message.image_id)}>
                <ListItemText
                  primary={`From: ${message.owner_username}`}
                  secondary={message.display_time}
                />
              </ListItem>
            </Slide>
          ))}
        </List>
      </Paper>
      <IconButton
        onClick={fetchChatMessages}
        sx={{ position: 'absolute', top: 8, right: 8 }}
        color="primary"
      >
        <RefreshIcon />
      </IconButton>
    </Box>
  );
};

export default ChatMessages;
