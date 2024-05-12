import React, { useState } from 'react';
import { Box, Button, TextField, FormControlLabel, Checkbox, Typography, Modal, Snackbar, Alert } from '@mui/material';
import { axiosInstance } from "../utils";  // Ensure axiosInstance is correctly imported from utilities

const responsiveStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 }, // Use 90% width on extra-small screens, and 400px width starting from small screens
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export const CreateChatModal = () => {
    const [open, setOpen] = useState(false);
    const [chatTitle, setChatTitle] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setError(null);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post('Chat/', {
                topic: chatTitle,
                is_public: isPublic
            });
            setSnackbarMessage('Chat created successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            setChatTitle('');
            setIsPublic(true);
            handleClose(); // Close modal upon successful submission
        } catch (error) {
            setError('Failed to create chat.');
            setSnackbarMessage('Failed to create chat.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
      <div>
        <Button variant="contained" onClick={handleOpen}>Create New Chat</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="create-chat-modal"
          aria-describedby="create-new-chat-form"
        >
          <Box sx={responsiveStyle}>
            <Typography id="create-chat-modal-title" variant="h6" component="h2">
              New Chat
            </Typography>
            <Box component="form" noValidate onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
              <TextField
                required
                fullWidth
                id="chat-title"
                label="Title of the Chat"
                margin="normal"
                inputProps={{ maxLength: 40 }}
                value={chatTitle}
                onChange={(e) => setChatTitle(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />}
                label="Public Chat"
              />
              <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2 }}>
                {loading ? 'Creating...' : 'Submit'}
              </Button>
            </Box>
          </Box>
        </Modal>
        <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>
      </div>
    );
};
