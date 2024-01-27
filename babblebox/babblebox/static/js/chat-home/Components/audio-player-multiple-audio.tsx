import Slider from "@mui/material/Slider";
import React, { useState, useEffect } from 'react';
import { Howl } from 'howler';

const AudioPlayerMultipleAudio = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Audio files
  const audioClips = [
    { src: 'http://localhost:8000/media/audios/audiofile_M6WR7o8.webm', length: 7 }, // Audio 1 - 7 seconds
    { src: 'http://localhost:8000/media/audios/audiofile_M6WR7o8.webm', length: 8 }  // Audio 2 - 8 seconds
  ];

  // Total length of both audio files
  const totalLength = audioClips.reduce((acc, clip) => acc + clip.length, 0);

  // Howler Sound objects
  const sounds = audioClips.map(clip => new Howl({ src: [clip.src] }));

  const playSound = (time) => {
    // Determine which audio to play
    console.log(time)
    let elapsedTime = 0;
    for (let i = 0; i < sounds.length; i++) {
      if (time < elapsedTime + audioClips[i].length) {
        sounds[i].seek(time - elapsedTime);
        sounds[i].play();
        break;
      }
      elapsedTime += audioClips[i].length;
    }
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
    playSound(newValue);
  };

  useEffect(() => {
    // Stop and unload sounds on component unmount
    return () => {
      sounds.forEach(sound => {
        sound.stop();
        sound.unload();
      });
    };
  }, []);

  return (
    <div>
      <Slider
        value={sliderValue}
        onChange={handleSliderChange}
        max={totalLength}
      />
    </div>
  );
};

export default AudioPlayerMultipleAudio;