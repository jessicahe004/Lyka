import React, { useState } from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import FileUploadForm from './FileUploadForm';
import './LandingPage.css'; // Import the CSS file

const LandingPage: React.FC = () => {
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);

  const handleStartClick = () => {
    setShowUploadForm(true);
  };

  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      height="100vh" 
      bg="gray.100" 
      position="relative"
      overflow="hidden"
      p={5}
    >
      {/* Conditionally render circles */}
      {!showUploadForm && (
        <>
          <div className="circle circle-top-left"></div>
          <div className="circle circle-top-left circle-2"></div>
          <div className="circle circle-top-left circle-3"></div>
          <div className="circle circle-bottom-right"></div>
          <div className="circle circle-bottom-right circle-2"></div>
          <div className="circle circle-bottom-right circle-3"></div>
        </>
      )}

      {!showUploadForm ? (
        <Box textAlign="center">
          <Heading mb={4}>Lyka</Heading>
          <Text mb={6}>
            Culture First AI Physician 
          </Text>
          <Button 
            colorScheme="blue" 
            size="lg" 
            onClick={handleStartClick}
          >
            Start by Scanning 
          </Button>
        </Box>
      ) : (
        <FileUploadForm />
      )}
    </Box>
  );
};

export default LandingPage;
