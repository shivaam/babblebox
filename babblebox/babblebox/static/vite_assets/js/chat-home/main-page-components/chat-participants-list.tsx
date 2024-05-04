import React, { useEffect, useState } from 'react';
import { Box, Fab, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import { axiosInstance } from '../utils';
import { AddChatParticipant } from './add-chat-participant-model';
import AddIcon from '@mui/icons-material/Add';

interface Participant {
    user: string;
    username: string;
    has_write_access: boolean;
    has_read_access: boolean;
}

export function ChatParticipants({ chatId }) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
      setModalOpen(true);
  };

  const handleCloseModal = () => {
      setModalOpen(false);
  };
  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      try {
        // Adjust the endpoint as necessary
        const response = await axiosInstance.get(`/ChatParticipant/?chat_id=${chatId}`);
        console.log(response.data)
        setParticipants(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to fetch participants.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [chatId]);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box style={{ position: 'relative', height: '30vh' }}> {/* Container with relative positioning */}
    <Paper style={{ maxHeight: '30vh', overflow: 'auto' }}>
        <List>
            {participants.map((participant) => (
                <ListItem key={participant.user}>
                    <ListItemText primary={participant.username} />
                </ListItem>
            ))}
        </List>
    </Paper>
    <Fab
        color="primary"
        aria-label="add"
        style={{
            position: 'absolute', // FAB positioned absolutely within the Box
            right: 20,
            bottom: 20,
            zIndex: 1000
        }}
        onClick={handleOpenModal}
    >
        <AddIcon />
    </Fab>
    <AddChatParticipant
        chatId={chatId}
        open={modalOpen}
        handleClose={handleCloseModal}
    />
</Box>
  );
}
