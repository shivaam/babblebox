import React from 'react';
import {Paper, Typography, List, ListItem, Divider, Grid} from '@mui/material';


export const MyPage = () => {
  return (
    <div style={{ flexGrow: 1, padding: 20 }}>
      <Grid container spacing={3}>
        {/* First Column - Conversations */}
        <Grid item xs={2}>
          <Paper style={{ height: '100%', padding: 10 }}>
            <Typography variant="h6">Conversations</Typography>
            <List>
              {/* Add conversation items here */}
              <ListItem>Conversation 1</ListItem>
              <ListItem>Conversation 2</ListItem>
              {/* ... */}
            </List>
          </Paper>
        </Grid>

        {/* Second Column - List of Audios */}
        <Grid item xs={2}>
          <Paper style={{ height: '100%', padding: 10 }}>
            <Typography variant="h6">Audio List</Typography>
            <List>
              {/* Add audio items here */}
              <ListItem>Audio 1</ListItem>
              <ListItem>Audio 2</ListItem>
              {/* ... */}
            </List>
          </Paper>
        </Grid>

        {/* Third Column - Artwork and Transcriptions */}
        <Grid item xs={8}>
          <Paper style={{ height: '100%', padding: 10 }}>
            <Typography variant="h6">Artwork and Transcriptions</Typography>
            <Divider />
            {/* Add your artwork, images, and text here */}
            <Typography>Artwork/Image 1</Typography>
            <Typography>Transcription text...</Typography>
            {/* ... */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};