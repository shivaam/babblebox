import React from 'react';
import Box from '@mui/material/Box';
import { CreateChatModal } from './create-chat-model';
import { ChatSections } from './chat-sections';

const Home: React.FC = () => {
    return (
        <Box sx={{ p: 1 }}>
            <CreateChatModal />
            <ChatSections />
        </Box>
    );
};

export default Home;
