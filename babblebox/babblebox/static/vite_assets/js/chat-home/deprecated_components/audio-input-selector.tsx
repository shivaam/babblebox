import React, { useEffect, useState, ChangeEvent } from "react";

interface AudioDevice {
  deviceId: string;
  label: string;
}

//Only works for chrome right now.
//https://webrtc.github.io/samples/src/content/devices/input-output/
export const AudioInputSelector: React.FC = () => {
  const [audioDevices, setAudioDevices] = useState<AudioDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices()
      .then(devices => {
        const filteredDevices: AudioDevice[] = devices
          .filter(device => device.kind === 'audioinput')
          .map(device => ({ deviceId: device.deviceId, label: device.label }));

        setAudioDevices(filteredDevices);

        if (filteredDevices.length > 0) {
          setSelectedDeviceId(filteredDevices[0].deviceId);
        }
      })
      .catch(err => {
        console.error('Error fetching devices: ', err);
      });
  }, []);

  const handleDeviceChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedDeviceId(e.target.value);
  };

  return (
    <div>
      <label htmlFor="audioInputSelect">Select Microphone: </label>
      <select id="audioInputSelect" value={selectedDeviceId} onChange={handleDeviceChange}>
        {audioDevices.map(device => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Device ${device.deviceId}`}
          </option>
        ))}
      </select>
    </div>
  );
};