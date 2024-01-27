import React, { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import axios from 'axios';

interface AudioFile {
  id: string;
  audio: HTMLAudioElement; // URL of the audio file
  transcription_en: string;
}

const TestAudioPlayer: React.FC = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [audio, setAudio] = useState( new Audio('http://localhost:8000/media/audios/audiofile_M6WR7o8.webm'))

  // useEffect(() => {
  //   axios.get<AudioFile[]>('http://localhost:8000/api/AudioFile/') // Replace with your API endpoint
  //     .then(response => {
  //       setAudioFiles(response.data);
  //       setAudio(audioFiles[0].audio)
  //     })
  //     .catch(error => console.error('Error fetching audio files:', error));
  // }, []);


  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(7);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlayPause = () => {
    const prevState = isPlaying;
    setIsPlaying(!prevState);
    console.log(audio)
    if (!prevState) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  useEffect(() => {
    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      console.log("Audio duration:", audio.duration)
      setDuration(7);
    });

    return () => {
      audio.removeEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
      audio.removeEventListener('loadedmetadata', () => setDuration(audio.duration));
    };
  }, [audio]);

  const onSeek = (e, newValue) => {
    setCurrentTime(newValue);
    audio.currentTime = newValue;
  };

  return (
    <div>
      <button onClick={togglePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
      <Slider
        min={0}
        max={duration}
        value={currentTime}
        onChange={onSeek}
      />
    </div>
  );
};

export default TestAudioPlayer;