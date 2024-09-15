import React, { useState, useRef } from 'react';
import { Button, Text } from '@chakra-ui/react';

interface AudioRecorderProps {
  onAudioCapture: (audioBlob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioCapture }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          onAudioCapture(event.data); // Pass the audio blob back to parent
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please ensure you have granted permission.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  return (
    <div>
      <Text mb={4}>(OPTIONAL) Add audible context.</Text>
      <Button onClick={recording ? stopRecording : startRecording} colorScheme="teal">
        {recording ? 'Stop Recording' : 'Start Recording'}
      </Button>
    </div>
  );
};

export default AudioRecorder;
