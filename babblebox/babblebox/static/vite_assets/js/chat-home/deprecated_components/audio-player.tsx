import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Button, Divider, Typography, Container } from '@mui/material';

interface AudioFile {
  id: string;
  audio: string; // URL of the audio file
  transcription_en: string;
}

export const AudioPlayer: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);

  useEffect(() => {
    axios.get<AudioFile[]>('http://localhost:8000/api/AudioFile/') // Replace with your API endpoint
      .then(response => {
        setAudioFiles(response.data);
      })
      .catch(error => console.error('Error fetching audio files:', error));
  }, []);

  const handlePlayAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <Container maxWidth="lg" style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: 'center', marginBottom: '30px' }}>
        Audio Files
      </Typography>

      <List>
        {audioFiles.map((audioFile) => (
          <React.Fragment key={audioFile.id}>
            <ListItem style={{ backgroundColor: '#ffffff', margin: '10px 0', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}>
              <ListItemText
                primary={`Audio ID: ${audioFile.id}`}
                primaryTypographyProps={{ style: { fontWeight: 'bold' } }}
              />

              <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0 10px' }}>

                <div style={{ flex: 1, textAlign: 'right', fontStyle: 'italic' }}>
                  {audioFile.transcription_en}
                </div>
              </div>

              <audio controls preload="metadata" style={{ width: '100%', marginTop: '10px' }}>
                <source type="audio/mpeg" src={audioFile.audio} />
              </audio>
            </ListItem>

            <Divider style={{ margin: '10px 0' }} />
          </React.Fragment>
        ))}
      </List>
    </Container>
  );
};

export default AudioPlayer;
