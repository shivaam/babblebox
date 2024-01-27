import {styled} from "@mui/material";
import * as React from 'react';
import MainPage from "./main-page-components/main-page";


const WallPaper = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  overflow: 'hidden',
  background: 'linear-gradient(rgb(255, 38, 142) 0%, rgb(255, 105, 79) 100%)',
  transition: 'all 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275) 0s',
  '&::before': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    top: '-40%',
    right: '-50%',
    background:
      'radial-gradient(at center center, rgb(62, 79, 249) 0%, rgba(62, 79, 249, 0) 64%)',
  },
  '&::after': {
    content: '""',
    width: '140%',
    height: '140%',
    position: 'absolute',
    bottom: '-50%',
    left: '-30%',
    background:
      'radial-gradient(at center center, rgb(247, 237, 225) 0%, rgba(247, 237, 225, 0) 70%)',
    transform: 'rotate(30deg)',
  },
});


export default function App() {
  // const addAudioElement = (blob: Blob) => {
  //   console.log(blob);
  //   uploadAudio(blob)
  //   const url = URL.createObjectURL(blob);
  //   const audio = document.createElement('audio');
  //   audio.src = url;
  //   audio.controls = true;
  //   document.body.appendChild(audio);
  // };
  // function uploadAudio(blob) {
  //   let formData = new FormData();
  //   formData.append('audio', blob, 'audiofile.webm'); // 'audiofile.mp3' is the name you want to save as
  //
  //   fetch('http://localhost:8000/api/AudioFile/', { // Replace with your API endpoint
  //     method: 'POST',
  //     body: formData
  //   })
  //     .then(response => response.json())
  //     .then(data => console.log(data))
  //     .catch(error => console.error(error));
  // }

  // return (
  //   <div>
  //     <MyPage></MyPage>
  //   </div>
  // )
  return (
    <div>
    <MainPage/>



      {/*<AudioRecorder*/}
      {/*  onRecordingComplete={addAudioElement}*/}
      {/*  audioTrackConstraints={{*/}
      {/*    noiseSuppression: true,*/}
      {/*    echoCancellation: true,*/}
      {/*    // autoGainControl,*/}
      {/*    // channelCount,*/}
      {/*    // deviceId,*/}
      {/*    // groupId,*/}
      {/*    // sampleRate,*/}
      {/*    // sampleSize,*/}
      {/*  }}*/}
      {/*  onNotAllowedOrFound={(err) => console.table(err)}*/}
      {/*  downloadOnSavePress={false}*/}
      {/*  downloadFileExtension="webm"*/}
      {/*  mediaRecorderOptions={{*/}
      {/*    audioBitsPerSecond: 128000,*/}
      {/*  }}*/}
      {/*  showVisualizer={true}*/}
      {/*/>*/}
      {/*<AudioPlayer></AudioPlayer>*/}
      {/*<TestAudioPlayer/>*/}
      {/*<AudioPlayerMultipleAudio/>*/}
      {/*<br/>*/}
      {/*<WallPaper>*/}

      {/*<br />*/}
      {/*<MusicPlayerSlider />*/}
      {/*<br />*/}
      {/*</WallPaper>*/}
      {/*/!*<AudioInputSelector/>*!/*/}
    </div>
  );
}
