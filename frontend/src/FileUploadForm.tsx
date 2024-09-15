import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import ImageCapture from './ImageCapture';
import AudioRecorder from './AudioRecorder';
import Questionnaire from './Questionaire';
import './FileUploadForm.css';

const FileUploadForm: React.FC = () => {
  const [step, setStep] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [questionnaire, setQuestionnaire] = useState({
    id: '',
    treatment: '',
    symptoms: [] as string[],
    additionalInfo: ''
  });
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuestionnaire(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setQuestionnaire(prev => ({
      ...prev,
      treatment: e.target.value
    }));
  };

  const handleSymptomsChange = (selectedSymptoms: string[]) => {
    setQuestionnaire(prev => ({
      ...prev,
      symptoms: selectedSymptoms
    }));
  };

  const handleFileUpload = async () => {
    if (!image || !audioBlob || !questionnaire.id || !questionnaire.treatment || questionnaire.symptoms.length === 0) {
      alert('Please complete all fields: capture an image, record audio, and fill out the questionnaire.');
      return;
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('audio', new File([audioBlob], 'audio.wav', { type: 'audio/wav' }));
    formData.append('id', questionnaire.id);
    formData.append('treatment', questionnaire.treatment);
    formData.append('symptoms', JSON.stringify(questionnaire.symptoms));
    formData.append('additionalInfo', questionnaire.additionalInfo);

    try {
      const response = await axios.post('http://localhost:8000/api/input', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('File upload response:', response.data);
      alert('Files and questionnaire submitted successfully!');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Error submitting files and questionnaire:', error.response?.data);
        alert(`Error submitting files: ${error.response?.data?.detail || error.message}`);
      } else {
        console.error('Unexpected error:', error);
        alert('Unexpected error occurred. Please try again.');
      }
    }
  };

  const goToNext = () => {
    setStep((prevStep) => (prevStep + 1) % 3);
  };

  const goToPrevious = () => {
    setStep((prevStep) => (prevStep - 1 + 3) % 3); 
  };

  return (
    <Box
      className="file-upload-form"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      p={8}
      borderRadius="15px"
      bg="white"
      boxShadow="0 8px 32px rgba(0, 0, 0, 0.2)"
      backdropFilter="blur(12px)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      position="relative"
    >
      <Heading mb={4} color="#5E503F">
        Patient Questionnaire
      </Heading>
      
      {/* Number Counter */}
      <Text mb={4} fontSize="lg" color="#5E503F">
        Step {step + 1} of 3
      </Text>

      <div className="carousel-container">
        {step === 0 && (
          <Questionnaire
            questionnaire={questionnaire}
            handleInputChange={handleInputChange}
            handleSelectChange={handleSelectChange}
            handleSymptomsChange={handleSymptomsChange}
          />
        )}
        {step === 1 && (
          <ImageCapture onImageCapture={setImage} />
        )}
        {step === 2 && (
          <AudioRecorder onAudioCapture={setAudioBlob} />
        )}
      </div>

      <Box className="navigation-buttons" mt={4}>
        <Button
          className="navigation-button"
          onClick={goToPrevious}
          disabled={step === 0}
        >
          Previous
        </Button>
        {step < 2 && (
          <Button
            className="navigation-button"
            onClick={goToNext}
          >
            Next
          </Button>
        )}
        {step === 2 && (
          <Button
            onClick={handleFileUpload}
            bg="#4a2c2a" /* Dark brown color */
            color="white" /* White text color for contrast */
            border="none" /* Remove default border */
            p="10px 20px" /* Add padding for better appearance */
            borderRadius="5px" /* Rounded corners for the button */
            cursor="pointer" /* Change cursor to pointer on hover */
            fontWeight="bold" /* Make the text bold */
            _hover={{ bg: '#3e1f1d' }} /* Slightly darker brown for hover effect */
          >
            Submit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default FileUploadForm;
