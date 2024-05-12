import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, FormControlLabel, Checkbox, Typography, Modal, Snackbar, Alert, Autocomplete, styled } from '@mui/material';
import { axiosInstance } from "../utils";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: 400 }, // Use 90% width on extra-small screens, and 400px width starting from small screens
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 4,
};

export const AddChatParticipant = ({ chatId, open, handleClose }) => {
    const [users, setUsers] = useState([]);
    const [participantUsername, setParticipantUsername] = useState('');
    const [hasWriteAccess, setHasWriteAccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/users/');
                setUsers(response.data);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        fetchUsers();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post('/ChatParticipant/', {
                chat: chatId,
                user: participantUsername,
                has_write_access: hasWriteAccess
            });
            setSnackbarMessage('Participant added successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
            handleClose();
        } catch (error) {
            setError('Failed to add participant.');
            setSnackbarMessage('Failed to add participant.');
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
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="add-participant-modal"
                aria-describedby="add-participant-form"
            >
                <Box sx={style}>
                    <Typography id="add-participant-modal-title" variant="h6" component="h2">
                        Add Participant
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
                        <Autocomplete
                            disablePortal
                            id="user-search"
                            options={users}
                            getOptionLabel={(option) => option.username}
                            sx={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Username" />}
                            onChange={(event, newValue) => setParticipantUsername(newValue ? newValue.id : '')}
                        />
                        <FormControlLabel
                            control={<Checkbox checked={hasWriteAccess} onChange={(e) => setHasWriteAccess(e.target.checked)} />}
                            label="Allow user to send messages"
                        />
                        <Button type="submit" fullWidth variant="contained" disabled={loading} sx={{ mt: 3, mb: 2 }}>
                            {loading ? 'Adding...' : 'Submit'}
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
