import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Paper, Box, Typography } from '@mui/material';
import {axiosInstance} from "../utils";
import { formatDistanceToNow } from 'date-fns';
import { useParams } from 'react-router-dom';
import MainPage from '../main-page-components/main-page';

interface Props {
  chatId: string; // Assuming you pass the selected chatId as a prop
}

export const ChatDetails: React.FC<Props> = () => {
  const { chatId } = useParams<{ chatId: string }>();

   //replace message id with number from 1 to N
return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
     <MainPage chatId={chatId || ''} />
    </Box>
);
};
