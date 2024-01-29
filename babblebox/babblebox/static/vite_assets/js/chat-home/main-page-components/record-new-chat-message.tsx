import { AudioRecorder } from 'react-audio-voice-recorder';

interface IRecordNewChatMessageProps {
  chatId: string;
}

export const RecordNewChatMessage: React.FC<IRecordNewChatMessageProps> = ({chatId}) => {

  // const addAudioElement = (blob: Blob) => {
  //   console.log(blob);
  //   uploadAudio(blob)
  //   const url = URL.createObjectURL(blob);
  //   const audio = document.createElement('audio');
  //   audio.src = url;
  //   audio.controls = true;
  //   document.body.appendChild(audio);
  // };
  //
  function uploadAudio(blob) {
    let formData = new FormData();
    const audioBlob = new Blob([blob], { type: 'audio/mp3' });

    formData.append('chat_id', chatId);
    formData.append('audio_file.audio', audioBlob, 'filename.mp3'); // 'filename.mp3' is the name of your file
    formData.append('image_id', '');
    const csrf_token = document.querySelector('[name=csrfmiddlewaretoken]').value;
    fetch(`http://localhost:8000/api/ChatMessage/`, { // Replace with your API endpoint
      method: 'POST',
      body: formData,
      headers: {'X-CSRFToken': csrf_token},
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }
  return (
    <div>
      <AudioRecorder
        onRecordingComplete={uploadAudio}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
          // autoGainControl,
          // channelCount,
          // deviceId,
          // groupId,
          // sampleRate,
          // sampleSize,
        }}
        onNotAllowedOrFound={(err) => console.table(err)}
        downloadOnSavePress={false}
        downloadFileExtension="webm"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
        showVisualizer={true}
      />
    </div>
  )
}
