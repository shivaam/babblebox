import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Paper, Box } from '@mui/material';
import axios from 'axios';

interface Chat {
  id: string;
  topic: string;
}

// Add onChatSelect to the component's props
interface ChatListProps {
  onChatSelect: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({onChatSelect}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        // Replace with your actual endpoint
        const response = await axios.get<Chat[]>('http://localhost:8000/api/Chat/');
        setChats(response.data);
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
// if chat array size is 0
  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Paper sx={{ maxHeight: '100%', overflow: 'auto' }}>
        <List>
          {loading && <ListItem><ListItemText primary="Loading chats..." /></ListItem>}
          {error && <ListItem><ListItemText primary={error} /></ListItem>}


          {chats.length === 0 && !loading && !error ? <ListItem><ListItemText primary="No chats found." /></ListItem> :
          chats.map((chat) => (
            <ListItem button key={chat.id} onClick={() => onChatSelect(chat.id)} >
              <ListItemText primary={chat.topic} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default ChatList;
