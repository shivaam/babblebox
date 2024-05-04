import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Paper, Box, IconButton, Button, TextField, FormGroup, FormControlLabel, Checkbox, Slide } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { yellow } from '@mui/material/colors';

import { axiosInstance } from "../utils";

interface Chat {
  id: string;
  topic: string;
}

interface ChatListProps {
  onChatSelect: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ onChatSelect }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [newChatTitle, setNewChatTitle] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get<Chat[]>('Chat/');
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

  const onCreateChat = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post<Chat>('Chat/', { topic: newChatTitle, is_public: isPublic });
      setChats([...chats, response.data]);
      setError(null);
      setIsCreating(false);
      setNewChatTitle('');
      setIsPublic(false);
    } catch (error) {
      setError('Failed to create chat.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: '90%', overflow: 'auto', bgcolor: yellow[100] }}>
      <Paper sx={{ maxHeight: '100%', overflow: 'auto', bgcolor: yellow[200] }}>
        <List>
          {loading && <ListItem><ListItemText primary="Loading chats..." /></ListItem>}
          {error && <ListItem><ListItemText primary={error} /></ListItem>}
          {chats.length === 0 && !loading && !error && <ListItem><ListItemText primary="No chats found." /></ListItem>}
          {chats.map((chat) => (
            <ListItem button key={chat.id} onClick={() => onChatSelect(chat.id)}>
              <ListItemText primary={chat.topic} />
            </ListItem>
          ))}
          <Slide direction="down" in={isCreating} mountOnEnter unmountOnExit>
            <ListItem>
              <FormGroup>
                <TextField label="Chat Title" variant="outlined" size="small" value={newChatTitle} onChange={(e) => setNewChatTitle(e.target.value)} fullWidth margin="dense" />
                <FormControlLabel control={<Checkbox checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />} label="Public Chat" />
                <Button variant="contained" color="primary" onClick={onCreateChat} sx={{ mt: 1 }}>
                  Confirm
                </Button>
              </FormGroup>
            </ListItem>
          </Slide>
          <ListItem>
            <IconButton onClick={() => setIsCreating(!isCreating)} sx={{ color: yellow[800] }}>
              <AddCircleOutlineIcon />
            </IconButton>
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
};

export default ChatList;
