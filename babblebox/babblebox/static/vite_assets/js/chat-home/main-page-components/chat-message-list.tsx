import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Paper, Box, Typography } from '@mui/material';
import axios from 'axios';
import {axiosInstance} from "../utils";
import {RecordNewChatMessage} from "./record-new-chat-message";
import { formatDistanceToNow } from 'date-fns';
import { RecordNewChatMessage2 } from './record-chat-message-2';

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

  useEffect(() => {
    const fetchChatMessages = async () => {
      setLoading(true);
      try {
        // Replace with your actual endpoint, append the chatId to fetch messages for a specific chat
        const response = await axiosInstance.get<ChatMessage[]>(`ChatMessage/?chat_id=${chatId}`);
        var messageData = response.data;
        messageData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        //convert the timestamp to a human readable format cool format like x mins ago using some library
        messageData.forEach((message) => {
          message.display_time = formatDistanceToNow(new Date(message.timestamp), { addSuffix: true });
        });


        setChatMessages(messageData);
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

   //replace message id with number from 1 to N
  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <RecordNewChatMessage2 chatId={chatId} />
      <Paper sx={{ maxHeight: '100%', overflow: 'auto' }}>
        <List>
          {loading && <ListItem><ListItemText primary="Loading messages..." /></ListItem>}
          {error && <ListItem><ListItemText primary={error} /></ListItem>}
          {chatMessages.map((message) => (
            <ListItem key={message.id} onClick={() => onAudioMessageSelect(message.audio_message_id, message.image_id)}>
              <ListItemText
                primary={`From: ${message.owner_username}`}
                secondary={message.display_time}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ChatMessages;
